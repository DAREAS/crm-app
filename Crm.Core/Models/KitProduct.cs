namespace Crm.Core.Models
{
    public class KitProduct :  BaseModel
    {
        public long ProductId { get; set; }
        public long KitId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal PricePerUnity { get; set; }
        public Product? Product { get; set; }
        public Kit? Kit { get; set; }
    }
}