function scrap()
{
	var data = [];
	var pageCount= $('.a-pagination li:nth-last-child(2)').text();
	var currentPage=$('.a-pagination li.a-selected').text();
	var reviewCountPerPage = $('div[data-hook=review]').length;

	for(var i=0;i<=reviewCountPerPage-1;i++)
	{
		currentPage=$('.a-pagination li.a-selected').text();

		var review= $('div[data-hook=review]')[i];
		var reviewTitle = $($(review).find('a[data-hook=review-title]')).text();
		var starRating =  $($(review).find('i[data-hook=review-star-rating] span')).text();
		var reviewBody =  $($(review).find('span[data-hook=review-body]')).text();
		var verifiedPurchase = $($(review).find('span[data-hook=avp-badge]')).text();
		var reviewAuthor = $($(review).find('a[data-hook=review-author]')).text();
		var reviewAuthorProfile = $($(review).find('a[data-hook=review-author]')).attr('href');
		var reviewDate = $($(review).find('span[data-hook=review-date]')).text();
		var helpful = $($(review).find('span[data-hook=helpful-vote-statement]')).text();
		console.log(reviewTitle);
		data.push({'Review Title': reviewTitle, 'Rating': starRating, 'Review': reviewBody, 'Verified':verifiedPurchase, 'Author': reviewAuthor, 'Author Profile': reviewAuthorProfile, 'Review Date': reviewDate, 'Helpful': helpful});
		
		if((i+1)==reviewCountPerPage && parseInt(pageCount) > parseInt(currentPage))
		{
			$('.a-pagination li.a-selected').next().find('a')[0].click();
			setTimeout(function () {
				scrap();
			}, 3000)
		}
		else if((i+1)==reviewCountPerPage && parseInt(pageCount) == parseInt(currentPage))
		{
			SaveData(data);
			Download();
		}
	}
	
}

function SaveData(data)
{
	var savedData = localStorage.getItem('reviews');
	if(savedData == null)
	{
		localStorage.setItem('reviews', JSON.stringify(data));
		//localStorage.setItem('reviews', data);
		return;
	}
	else
	{
		var oldItems = JSON.parse(savedData);
		var finalObj = oldItems.concat(data);
		console.log(finalObj);
		localStorage.setItem('reviews', JSON.stringify(finalObj));
	}
}

function Download()
{
	var ReportTitle="Reviews Report";
	////localStorage.removeItem('reviews');
	var savedData = localStorage.getItem('reviews');
	var data = JSON.parse(savedData);
	
	// var data = [
    // {"name":"John", "city": "Seattle"},
    // {"name":"Mike", "city": "Los Angeles"},
    // {"name":"Zach", "city": "New York"}
	// ];

	/* this line is only needed if you are not adding a script tag reference */
	if(typeof XLSX == 'undefined') XLSX = require('xlsx');

	/* make the worksheet */
	var ws = XLSX.utils.json_to_sheet(data);

	/* add to workbook */
	var wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Reviews");

	/* write workbook (use type 'binary') */
	var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});

	/* generate a download */
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}

	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "Reviews.xlsx");
	
	
}

scrap();