using System.Collections.ObjectModel;

namespace CrmApp.Pages.Products;

public partial class ProductPage : ContentPage
{
	private readonly List<string> _expirations = new List<string>();
	private readonly long _productId = 0;

	public ProductPage(long productId = 0)
	{
		InitializeComponent();
		this.Title = "Cadastro de Produto";

        _productId = productId;
        _expirations = new List<string>()
		{
			"Selecione",
			"Por Mês",
			"Por Ano",
			"Por Dia"
		};

		ExpirationPeriodType.ItemsSource = _expirations;
	}

    private async void SaveProduct(object sender, EventArgs e)
    {
		ClearFields();

        if (!CanExitPage.IsChecked)
		{
			await Navigation.PopAsync(true);
		}
    }

	private async void Cancel(object sender, EventArgs e)
	{
		await Navigation.PopAsync(true);
	}

    private void CanExitPage_CheckedChanged(object sender, CheckedChangedEventArgs e)
    {

    }

	private void ClearFields()
	{
		Code.Text = string.Empty;
		ExternalCode.Text = string.Empty;
		Name.Text = string.Empty;
		Description.Text = string.Empty;
		Price.Text = string.Empty;
		OriginalCost.Text = string.Empty;
		ExperationTime.Text = string.Empty;
		ActualQuantity.Text = string.Empty;
		SecurityQuantity.Text = string.Empty;
		MinimalQuantity.Text = string.Empty;
	}
}