// Services/EmailService.cs
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace CineNiche.Services   // <- keep this EXACTLY the same everywhere
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var host = _config["Email:Host"];
            var port = int.Parse(_config["Email:Port"]);
            var user = _config["Email:Username"];
            var pass = _config["Email:Password"];

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(user, pass)
            };

            var mail = new MailMessage
            {
                From    = new MailAddress(user),
                Subject = subject,
                Body    = body,
                IsBodyHtml = true
            };
            mail.To.Add(toEmail);

            await client.SendMailAsync(mail);
        }
    }
}
