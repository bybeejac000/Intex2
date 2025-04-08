using System.Security.Claims;
using CineNiche.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<ApplicationUser> userManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor) { }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? ""));
        identity.AddClaim(new Claim(ClaimTypes.MobilePhone, user.PhoneNumber ?? ""));
        identity.AddClaim(new Claim("FirstName", user.FirstName ?? ""));
        identity.AddClaim(new Claim("LastName", user.LastName ?? ""));
        identity.AddClaim(new Claim("Zip", user.Zip ?? ""));
        identity.AddClaim(new Claim("State", user.State ?? ""));

        return identity;
    }
}
