namespace Crm.Core.Models
{
    public class User : BaseModel
    {
       public string UserName { get; set; } = string.Empty;
       public string Password { get; set; } = string.Empty;
    }
}