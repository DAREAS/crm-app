using Crm.DataContracts.Products;
using System.Net.WebSockets;

namespace CrmApp.Pages.Products;

public partial class ProductsPage : ContentPage
{
	private IEnumerable<ProductDataContract> _products = Enumerable.Empty<ProductDataContract>();
	public ProductsPage()
	{
		InitializeComponent();
		LoadProducts();
	}

	private void LoadProducts()
	{
		_products = new List<ProductDataContract>()
        {
            new()
            {
                Id = 1,
                Name = "Name",
                Description = "Description",
                Price = 150.00m,
                OriginalCost = 75.00m
            },
            new()
            {
                Id = 2,
                Name = "Name 2",
                Description = "Description 2",
                Price = 190.00m,
                OriginalCost = 80.00m
            }
        };

        ProductsView.ItemsSource = _products;

    }

    private async void OnAddProductButtonClicked(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new ProductPage());
    }

    private async void OnEditButtonClicked(object sender, EventArgs e)
	{
		var button = sender as Button;
		var productId = (long)button.CommandParameter;

        await Navigation.PushAsync(new ProductPage(productId));
    }

    private void OnDeleteButtonClicked(object sender, EventArgs e)
    {
        var button = sender as Button;
        var productId = (int)button.CommandParameter;

        var produto = _products.First(x => x.Id == productId);
        var produtos = _products.ToList();

        produtos.Remove(produto);
        _products = produtos;

        ProductsView.ItemsSource = _products;

        //_productService.DeleteProduct(productId);
        //LoadProducts();
    }
}