function isItemFilterable(item, headings, searchText){
    return headings.some(({ key }) => {
        if (!item[key]) return false;
        if (isNaN(item[key])) {
          if (item[key] && item[key].type && item[key].type === "link")
            return item[key].text.toLowerCase().indexOf(searchText) !== -1;
          else return item[key].toLowerCase().indexOf(searchText) !== -1;
        } else {
          return item[key].toString().indexOf(searchText) !== -1;
        }
      });
}

function getItemOrder(firstItem, secondItem, columnKey){
    let itemOrder;
        // Set the itemOrder using ascending order sorting
        if (typeof firstItem[columnKey] === "number")
          itemOrder = firstItem[columnKey] - secondItem[columnKey];
        else if (firstItem[columnKey] && firstItem[columnKey].text)
          itemOrder =
            firstItem[columnKey].text < secondItem[columnKey].text ? -1 : 1;
        else itemOrder = firstItem[columnKey] < secondItem[columnKey] ? -1 : 1;
    return itemOrder
}

export {
    isItemFilterable,
    getItemOrder
}