namespace Crm.Core.Models
{
    public class SaleProduct : BaseModel
    {
        public long ProductId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Discount { get; set; }
        public decimal SalePrice { get; set; }
        public long SaleId { get; set; }
        public Product? Product { get; set; }
        public Sale? Sale { get; set; }
    }
}