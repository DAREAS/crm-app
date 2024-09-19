using Crm.Core.Models.Enums;

namespace Crm.Core.Models
{
    public class Product : BaseModel
    {
        public string Code { get; set; } = string.Empty;
        public string ExternalCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public decimal? OriginalCost { get; set; }
        public ExpirationPeriod? ExpirationPeriodType { get; set; }
        public int? ExperationTime { get; set; }
        public decimal? ActualQuantity { get; set; }
        public decimal? SecurityQuantity { get; set; }
        public decimal? MinimalQuantity { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public DateTime? LastTimeBuy { get; set; }
    }
}
