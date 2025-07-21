export const searchFood = async (searchTerm) => {
  try {
    const results = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1&page_size=15`
    );
    const data = await results.json();

    if (!data.products || !Array.isArray(data.products)) {
      console.log("Invalid format");
      return [];
    }

    const products = data.products
      .filter(
        (item) =>
          item?.product_name &&
          item.product_name !== "" &&
          item?.code &&
          item.code !== ""
      )
      .map((item) => ({
        code: item.code,
        name: item.product_name,
        image_url: item.image_front_url || null,
        energy_kcal:
          item.nutriments["energy-kcal"] ??
          item.nutriments["energy-kcal_100g"] ??
          null,
        protein:
          item.nutriments.proteins ??
          item.nutriments.proteins_100g ??
          item.nutriments.proteins_value ??
          null,
        carbohydrates:
          item.nutriments.carbohydrates ??
          item.nutriments.carbohydrates_100g ??
          item.nutriments.carbohydrates_value ??
          null,
        fat_total:
          item.nutriments.fat ??
          item.nutriments.fat_100g ??
          item.nutriments.fat_value ??
          null,
      }));

    return products;
  } catch (error) {
    console.error("openFood api error search", error);
    return [];
  }
};

export const barcodeSearch = async (barcode) => {
  try {
    const results = await fetch(
      `https://world.openfoodfacts.net/api/v2/product/${barcode}`
    );
    const data = await results.json();

    if (data.status !== 1) {
      return null;
    } else {
      const product = data.product;
      const item = {
        code: product.code,
        name: product.product_name,
        image_url: product.image_front_url || null,
        energy_kcal:
          product.nutriments["energy-kcal"] ??
          product.nutriments["energy-kcal_100g"] ??
          null,
        protein:
          product.nutriments.proteins ??
          product.nutriments.proteins_100g ??
          product.nutriments.proteins_value ??
          null,
        carbohydrates:
          product.nutriments.carbohydrates ??
          product.nutriments.carbohydrates_100g ??
          product.nutriments.carbohydrates_value ??
          null,
        fat_total:
          product.nutriments.fat ??
          product.nutriments.fat_100g ??
          product.nutriments.fat_value ??
          null,
      };

      return item;
    }
  } catch (error) {}
};
