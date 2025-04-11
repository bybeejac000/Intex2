using CineNiche.Data;
using CineNiche.Services;               // ← shared EmailService
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace CineNiche.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser>  _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly EmailService                   _email;

        public AccountController(
            UserManager<ApplicationUser>  userManager,
            SignInManager<ApplicationUser> signInManager,
            EmailService                   email)
        {
            _userManager  = userManager;
            _signInManager = signInManager;
            _email         = email;
        }

        // ──────────────────────────  Registration  ──────────────────────────
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = new ApplicationUser
            {
                UserName   = model.Email,
                Email      = model.Email,
                FirstName  = model.FirstName,
                LastName   = model.LastName,
                Zip        = model.Zip,
                State      = model.State,
                PhoneNumber= model.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
                return Ok(new { message = "Registration successful" });

            foreach (var e in result.Errors) ModelState.AddModelError("", e.Description);
            return BadRequest(ModelState);
        }

        // ───────────────────────────────  Login  ─────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            var pwdOk = await _signInManager.CheckPasswordSignInAsync(user, model.Password, true);
            if (!pwdOk.Succeeded)
                return Unauthorized(new { message = "Invalid email or password." });

            // 2‑FA branch
            if (user.TwoFactorEnabled)
            {
                var code = TwoFaCodes.NewCode(user.Email!);
                await _email.SendEmailAsync(
                    user.Email!,
                    "Your CineNiche verification code",
                    $"Your 4‑digit code is {code}");

                await _signInManager.SignOutAsync();   // prevent partial cookie
                return Ok(new { twoFactorRequired = true, message = "Code sent." });
            }

            // Normal sign‑in
            await _signInManager.SignInAsync(user, false);
            return Ok(new { twoFactorRequired = false, message = "Login successful." });
        }

        // ────────────────  Two‑factor helpers (verify / resend)  ─────────────
        [HttpPost("verify2fa")]
        public IActionResult Verify2Fa([FromBody] CodeDto dto)
        {
            if (TwoFaCodes.Check(dto.Email, dto.Code))
            {
                TwoFaCodes.Delete(dto.Email);
                return Ok(new { message = "Code OK" });
            }
            return BadRequest(new { message = "Bad code" });
        }

        [HttpPost("resend2fa")]
        public async Task<IActionResult> Resend2Fa([FromBody] EmailDto dto)
        {
            var code = TwoFaCodes.NewCode(dto.Email);
            await _email.SendEmailAsync(
                dto.Email,
                "Your CineNiche verification code",
                $"Your 4‑digit code is {code}");
            return Ok(new { message = "Code re‑sent" });
        }

        public record CodeDto(string Email, string Code);
        public record EmailDto(string Email);

        // ─────────────────────────────  Logout  ──────────────────────────────
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logout successful" });
        }

        // ─────────────────────────────  Profile  ─────────────────────────────
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return NotFound(new { message = "User not found." });

            return Ok(new
            {
                firstName        = user.FirstName,
                lastName         = user.LastName,
                email            = user.Email,
                twoFactorEnabled = user.TwoFactorEnabled,
                state            = user.State,
                zip              = user.Zip,
                profilePictureId = user.ProfilePictureId
            });
        }

        [Authorize]
        [HttpPost("updateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized(new { message = "User not logged in." });

            if (!string.IsNullOrEmpty(model.FirstName))        user.FirstName       = model.FirstName;
            if (!string.IsNullOrEmpty(model.LastName))         user.LastName        = model.LastName;
            if (model.TwoFactor        != null)                user.TwoFactorEnabled= model.TwoFactor == 1;
            if (model.ProfilePictureId != null)                user.ProfilePictureId= model.ProfilePictureId.Value;

            var res = await _userManager.UpdateAsync(user);
            return res.Succeeded
                ? Ok(new { message = "Profile updated successfully." })
                : BadRequest(res.Errors);
        }

        // ─────────────────────────────  Toggle 2‑FA  ─────────────────────────
        [Authorize]
        [HttpPost("toggle2FA")]
        public async Task<IActionResult> ToggleTwoFactor()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            user.TwoFactorEnabled = !user.TwoFactorEnabled;
            var res = await _userManager.UpdateAsync(user);
            if (!res.Succeeded) return BadRequest(res.Errors);

            return Ok(new
            {
                message          = user.TwoFactorEnabled ? "2FA enabled." : "2FA disabled.",
                twoFactorEnabled = user.TwoFactorEnabled
            });
        }

        // ───────────  Place‑holders for e‑mail / password change  ────────────
        [Authorize]
        [HttpPost("changeEmail")]
        public IActionResult ChangeEmail()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            return Ok(new { message = $"An e‑mail was sent to {email} to change your e‑mail." });
        }

        [Authorize]
        [HttpPost("changePassword")]
        public IActionResult ChangePassword()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            return Ok(new { message = $"An e‑mail was sent to {email} to change your password." });
        }
    }

    // ─────────────────────────  Tiny in‑memory 2‑FA store  ───────────────────
    public static class TwoFaCodes
    {
        private static readonly ConcurrentDictionary<string,string> _codes = new();
        private static readonly Random _rng = new();

        public static string NewCode(string email)
        {
            var code = _rng.Next(1000, 10000).ToString("D4");
            _codes[email] = code;
            return code;
        }

        public static bool Check(string email, string code) =>
            _codes.TryGetValue(email, out var real) && real == code;

        public static void Delete(string email) => _codes.TryRemove(email, out _);
    }

    // ─────────────────────────────  DTO models  ──────────────────────────────
    public class LoginModel
    {
        public string Email    { get; set; } = default!;
        public string Password { get; set; } = default!;
    }

    public class UpdateProfileModel
    {
        public string? FirstName        { get; set; }
        public string? LastName         { get; set; }
        public int?    TwoFactor        { get; set; }   // 0 / 1
        public int?    ProfilePictureId { get; set; }
    }

    public class RegisterModel
    {
        public string Email       { get; set; } = default!;
        public string Password    { get; set; } = default!;
        public string FirstName   { get; set; } = default!;
        public string LastName    { get; set; } = default!;
        public string Zip         { get; set; } = default!;
        public string State       { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
    }
}
