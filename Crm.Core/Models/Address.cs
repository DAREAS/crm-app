using Crm.Core.Models.Enums;

namespace Crm.Core.Models
{
    public class Address : BaseModel
    {
        public AddressType Type { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string Complement { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
    }
}