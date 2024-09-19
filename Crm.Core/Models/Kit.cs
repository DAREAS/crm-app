namespace Crm.Core.Models
{
    public class Kit : BaseModel
    {
        public string Code { get; set; } = string.Empty;
        public string ExternalCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime InitialDateSale { get; set; }
        public DateTime FinishDateSale { get; set; }
        public decimal Price { get; set; }

        public ICollection<KitProduct>? Products { get; set; }
    }
}
