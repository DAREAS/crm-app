namespace Crm.Core.Models
{
    public class ClientAddress : BaseModel
    {
        public bool IsDefault { get; set; } = false;
        public bool IsBilling { get; set; } = false;
        public string ThirdPartyName { get; set; } = string.Empty;
        public long ClientId { get; set; }
        public Client? Client { get; set; }
        public long AdressId { get; set; }
        public Address? Address { get; set; }
    }
}