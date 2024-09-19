namespace Crm.Core.Models
{
    public class Client: BaseModel
    {
        public string Name { get; set; } = string.Empty;
        public string SocialName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public string IdentificationCard { get; set; } = string.Empty;
        public long SocialPoints { get; set; }
        public ICollection<ClientAddress>? Addresses { get; set; }
        public ICollection<ClientContact>? Contacts { get; set; }
        public ICollection<Sale>? Sales { get; set; }
    }
}
