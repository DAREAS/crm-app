using Crm.Core.Models.Enums;

namespace Crm.Core.Models
{
    public class Contact : BaseModel
    {
        public ContactType Type { get; set; }
        public string Value { get; set; } = string.Empty;
    }
}