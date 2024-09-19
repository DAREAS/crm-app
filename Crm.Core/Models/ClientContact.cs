namespace Crm.Core.Models
{
    public class ClientContact : BaseModel
    {
        public bool IsDefault { get; set; } = false;
        public bool IsWhatsApp { get; set; } = false;
        public string ThirdPartyContactName { get; set; } = string.Empty;
        public long ClientId { get; set; }
        public Client? Client { get; set; }
        public long ContactId { get; set; }
        public Contact? Contact { get; set; }
    }
}