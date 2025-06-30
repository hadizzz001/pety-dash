'use client';
import * as XLSX from 'xlsx';

const ExportToExcel = ({ products }) => {
const formatUSD = (value) => {
  const number = parseFloat(value);
  return isNaN(number) ? value : `$${number.toFixed(2)}`;
};


  const handleExport = () => {
    const flattenedData = [];

    products.forEach((product) => {
      if (product.type === 'single') {
        const row = {
          Title: product.title,
          Category: product.category,
          Origin: formatUSD(product.origin),
          Weight: product.weight,
          Profit: product.profit,
          Rate: formatUSD(product.rate),
          ShippingCost: formatUSD(product.shippingCost),
          Landing: formatUSD(product.landing),
          ProfitAmount: formatUSD(product.profitAmount),
          Date: product.date,
          Color: '', // no color info
          Type: 'single',
          Discount: formatUSD(product.discount),
          Stock: product.stock,
        };
        flattenedData.push(row);
      } else if (product.type === 'collection') {
        product.color.forEach((colorItem) => {
          if (colorItem.sizes) {
            // Collection with sizes
            colorItem.sizes.forEach((sizeItem) => {
              const row = {
                Title: product.title,
                Category: product.category,
                Origin: formatUSD(product.origin),
                Weight: product.weight,
                Profit: product.profit,
                Rate: formatUSD(product.rate),
                ShippingCost: formatUSD(product.shippingCost),
                Landing: formatUSD(product.landing),
                ProfitAmount: formatUSD(product.profitAmount),
                Date: product.date,
                Color: `${colorItem.color} - ${sizeItem.size}`,
                Type: 'collection',
                Discount: formatUSD(sizeItem.price), // use size.price
                Stock: sizeItem.qty+"",
              };
              flattenedData.push(row);
            });
          } else {
            // Collection with color only
            const row = {
              Title: product.title,
              Category: product.category,
              Origin: formatUSD(product.origin),
              Weight: product.weight,
              Profit: product.profit,
              Rate: formatUSD(product.rate),
              ShippingCost: formatUSD(product.shippingCost),
              Landing: formatUSD(product.landing),
              ProfitAmount: formatUSD(product.profitAmount),
              Date: product.date,
              Color: colorItem.color,
              Type: 'collection',
              Discount: formatUSD(product.discount),
              Stock: colorItem.qty+"",
            };
            flattenedData.push(row);
          }
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

    // Center all text in cells
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cell_address]) continue;
        if (!worksheet[cell_address].s) worksheet[cell_address].s = {};
        worksheet[cell_address].s.alignment = { horizontal: 'left' };

      }
    }

    worksheet['!cols'] = Array(Object.keys(flattenedData[0]).length).fill({ wch: 10 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    XLSX.writeFile(workbook, 'products-export.xlsx');
  };

  return (
    <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded mb-5">
      Export
    </button>
  );
};

export default ExportToExcel;
