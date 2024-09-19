namespace Crm.Core.Models
{
    public class Sale : BaseModel
    {
        public DateTime Date { get; set; }
        public long ClientId { get; set; }
        public long UserId { get; set; }
        public long TotalItems { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public decimal Total { get; set; }
        public decimal AmountPaid { get; set; }

        public User? User { get; set; }
        public Client? Client { get; set; }
        public ICollection<PaymentMethod>? Payments { get; set; }
        public ICollection<SaleProduct>? Products { get; set; }
    }
}
