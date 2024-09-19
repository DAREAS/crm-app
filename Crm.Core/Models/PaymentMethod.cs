using Crm.Core.Models.Enums;

namespace Crm.Core.Models
{
    public class PaymentMethod : BaseModel
    {
        public PaymentType Type { get; set; }
        public string ReceiptNumber { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public decimal AmountPaid { get; set; }
        public long SaleId { get; set; }
        public Sale? Sale { get; set; }
    }
}