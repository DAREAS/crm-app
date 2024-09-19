using Crm.Core.Models.Enums;

namespace Crm.DataContracts.Products
{
    public class ProductDataContract : BaseDataContract
    {
        public string Description { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public decimal? OriginalCost { get; set; }
        public ExpirationPeriod? ExpirationPeriod { get; set; }
        public int? ExperationTime { get; set; }
        public decimal? ActualQuantity { get; set; }
        public decimal? SecurityQuantity { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public DateTime? LastTimeBuy { get; set; }
    }
}
