using CineNiche.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CineNiche.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Registration Endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Zip = model.Zip,
                State = model.State,
                PhoneNumber = model.PhoneNumber,
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
                return Ok(new { message = "Registration successful" });
            else
            {
                foreach (var error in result.Errors)
                    ModelState.AddModelError(string.Empty, error.Description);
                return BadRequest(ModelState);
            }
        }

        // Login Endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            var result = await _signInManager.PasswordSignInAsync(
                user, 
                model.Password, 
                isPersistent: false, 
                lockoutOnFailure: false);

            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid email or password." });

            return Ok(new { message = "Login successful." });
        }

        // Logout Endpoint
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logout successful" });
        }

        // Get Profile Endpoint
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return NotFound(new { message = "User not found." });

            return Ok(new
            {
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                twoFactorEnabled = user.TwoFactorEnabled,
                state = user.State,
                zip = user.Zip,
                profilePictureId = user.ProfilePictureId
            });
        }

        // Update Profile Endpoint
        [Authorize]
        [HttpPost("updateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            if (!string.IsNullOrEmpty(model.FirstName))
                user.FirstName = model.FirstName;
            if (!string.IsNullOrEmpty(model.LastName))
                user.LastName = model.LastName;
            if (model.TwoFactor != null)
                user.TwoFactorEnabled = (model.TwoFactor == 1);
            if (model.ProfilePictureId != null)
                user.ProfilePictureId = model.ProfilePictureId.Value;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Profile updated successfully." });
        }

        // Toggle 2FA Endpoint
        [Authorize]
        [HttpPost("toggle2FA")]
        public async Task<IActionResult> ToggleTwoFactor()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            user.TwoFactorEnabled = !user.TwoFactorEnabled;
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                message = user.TwoFactorEnabled ? "2FA enabled." : "2FA disabled.",
                twoFactorEnabled = user.TwoFactorEnabled
            });
        }

        // Change Email (Placeholder) Endpoint
        [Authorize]
        [HttpPost("changeEmail")]
        public IActionResult ChangeEmail()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            return Ok(new { message = $"An email was sent to {email} to change your email." });
        }

        // Change Password (Placeholder) Endpoint
        [Authorize]
        [HttpPost("changePassword")]
        public IActionResult ChangePassword()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            return Ok(new { message = $"An email was sent to {email} to change your password." });
        }
    }

    // Models
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UpdateProfileModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        // 0 => false, 1 => true.
        public int? TwoFactor { get; set; }
        public int? ProfilePictureId { get; set; }
    }

    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Zip { get; set; }
        public string State { get; set; }
        public string PhoneNumber { get; set; }
    }
}
