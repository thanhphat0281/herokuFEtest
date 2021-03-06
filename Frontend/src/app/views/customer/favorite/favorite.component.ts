import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//favorite
import { BookService } from '../../../app-services/book-service/book.service';
import { Favorite } from 'src/app/app-services/favorite-service/favorite.model';
import { Book } from 'src/app/app-services/book-service/book.model';
import { CartBookService } from 'src/app/app-services/cartBook-service/cartBook.service';
import { CartBook } from 'src/app/app-services/cartBook-service/cartBook.model';
import { FavoriteService } from 'src/app/app-services/favorite-service/favorite.service';
declare var $: any;
@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  constructor(private _router: Router,private _favoriteService:FavoriteService,	private _cartBookDBService: CartBookService,private bookService: BookService) { }
	alertMessage = "";
	alertSucess = false;
  alertFalse = false;
  TongTien = 0;
	TongCount = 0;
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  loginBy: String = ""
  favorite: Favorite = new Favorite
  listFavorite :any
  listBookFavorite:any
  cartBookDB: CartBook = new CartBook;
	CartBook = [];
  lengthCartBook = 0;
  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    // if (this.statusLogin == null) { this._router.navigate(['/account']); }
    this.loginBy = localStorage.getItem('loginBy');
    this.getTotalCountAndPrice();
    this.getAllFavoriteByUserId();
    this.getAllBookFavorite();
 
  }
getAllBookFavorite(){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
		this._favoriteService.getAllBookFavoriteByUserID(this.accountSocial._id).subscribe(
			listFavorites =>{
        this.listBookFavorite = listFavorites as Book[];
        console.log(this.listBookFavorite)
			}
		)
}
}
// favorite Book
favoriteBook(bookID){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
  this.favorite.bookID=bookID;
  this.favorite.userID=this.accountSocial._id
  this._favoriteService.postFavorite(this.favorite).subscribe(
    aFavorite=>{ // aFavorite s??? tr??? v??? all favorite by userID
      this.listFavorite = aFavorite as Favorite[];
      this.ngOnInit()
  })
}else{
  this.alertMessage = "B???n ph???i ????ng nh???p ????? th???c hi???n thao t??c n??y";
  this.alertFalse = true;
  setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
}
}
getAllFavoriteByUserId(){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
  this._favoriteService.getAllFavoriteByUserID(this.accountSocial._id).subscribe(
    listFavorites =>{
      this.listFavorite = listFavorites as Favorite[];
    }  )
}
}
//validate favorite 
validateFavorite(id) {
if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
for(let index in this.listFavorite)
{
  if(id==this.listFavorite[index].bookID)
  return true;
}
return false
}
return false
}







  
  moveToProfileDetail(){
    this._router.navigate(['/accountProfile'])
  }
  moveToProfileAccountSocial(){
    this._router.navigate(['/accountProfileSocial'])
  }
  goToOrderHistory(){
    this._router.navigate(['/orderHistory'])
  }
  goToDiscountCode(){
    this._router.navigate(['/discountCode'])
  }
  goToFavorite(){
    this._router.navigate(['/favorites'])
  }





  //add book
  detailBook(book: Book) {

    return this._router.navigate(["/bookDetail" + `/${book._id}`]);
  }
  


  //#region  Add Book Cart
	postCartBookDB(selectedBook: Book) {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this.cartBookDB.userID = this.accountSocial._id;
			this.cartBookDB.bookID = selectedBook._id;
			this.cartBookDB.count = selectedBook.count;
			this._cartBookDBService.postCartBook(this.cartBookDB).subscribe(
				req => {
					console.log(req);
				},
				error => console.log(error)
			);
		}
	}
	putCartBookDB(selectedBook: Book) {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this.cartBookDB.userID = this.accountSocial._id;
			this.cartBookDB.bookID = selectedBook._id;
			this.cartBookDB.count = selectedBook.count;
			this._cartBookDBService.putCartBook(this.cartBookDB).subscribe(
				req => {
					console.log(req);
				},
				error => console.log(error)
			);
		}
	}
	// check count cart before add (hover )
	checkCountMax10 = true;
	checkCountCartBeforeAdd(selectedBook: Book) {
		this.checkCountMax10 = true;
		for (var i = 0; i < this.lengthCartBook; i++) {
			if (this.CartBook[i]._id == selectedBook._id) {
				//ki???m tra s??? l?????ng 
				if (this.CartBook[i].count == 10) {
					this.checkCountMax10 = false;
				}
				console.log(this.CartBook[i].count);
			}
		}
	}
	addABook = "";

	//add to cart (BookDetail,CountSelect)
	// s??? l?????ng t???i ??a ch??? ???????c 10 m???i qu???n s??ch , t??nh lu??n ???? c?? trong gi???

	checkedAddBook = true;
	addToCart(selectedBook: Book) {
		this.getBookByCategory(selectedBook.categoryID)
		this.addABook = selectedBook.nameBook;
		var CartBook = [];    //l??u tr??? b??? nh??? t???m cho localStorage "CartBook"
		var dem = 0;            //V??? tr?? th??m s??ch m???i v??o localStorage "CartBook" (n???u s??ch ch??a t???n t???i)
		var temp = 0;           // ????nh d???u n???u ???? t???n t???i s??ch trong localStorage "CartBook" --> count ++
		// n???u localStorage "CartBook" kh??ng r???ng

		if (localStorage.getItem('CartBook') != null) {
			//ch???y v??ng l???p ????? l??u v??o b??? nh??? t???m ( t???o m???ng cho Object)

			for (var i = 0; i < JSON.parse(localStorage.getItem("CartBook")).length; i++) {
				CartBook[i] = JSON.parse(localStorage.getItem("CartBook"))[i];
				// n???u id book ???? t???n t???i trong  localStorage "CartBook" 
				if (CartBook[i]._id == selectedBook._id) {
					temp = 1;  //?????t bi???n temp
					// n???u s??? l?????ng t???i ??a ch??? ???????c 10 m???i qu???n s??ch , t??nh lu??n ???? c?? trong gi??? th?? oke
					if (parseInt(CartBook[i].count) + 1 <= 10) {
						CartBook[i].count = parseInt(CartBook[i].count) + 1;  //t??ng gi?? tr??? count
						//c???p nh???t cartbook v??o db
						this.putCartBookDB(CartBook[i]);
					}
					else {
						//show alert
						this.checkedAddBook = false;
						//update l???i s??? l?????ng 


						this.alertMessage = "???? t???n t???i 10 qu???n s??ch " + CartBook[i].nameBook + " trong gi??? h??ng";
						this.alertFalse = true;
						setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
					}
				}
				dem++;  // ?????y v??? tr?? g??n ti???p theo
			}
		}

		if (temp != 1) {      // n???u s??ch ch??a c?? ( temp =0 ) th?? th??m s??ch v??o
			selectedBook.count = 1;  // set count cho s??ch
			CartBook[dem] = selectedBook; // th??m s??ch v??o v??? tr?? "dem" ( v??? tr?? cu???i) 
			//l??u cartbook v??o db
			this.postCartBookDB(selectedBook);
		}
		// ????? m???ng v??o localStorage "CartBook"
		localStorage.setItem("CartBook", JSON.stringify(CartBook));

		this.getTotalCountAndPrice();
		//  //show alert
		//  this.alertMessage="Th??m th??nh c??ng s??ch "+ selectedBook.nameBook +" v??o gi??? h??ng";
		//  this.alertSucess=true;
		//  setTimeout(() => {this.alertMessage="";this.alertSucess=false}, 6000); 

	}
	//#endregion

	goToCartBook(){
		return this._router.navigate(['/cartBook']);
	}
	BookByCategory:any
	getBookByCategory(idCategory){
		this.bookService.getBookByCategoryId(idCategory)
		.subscribe(resCategoryData => {

		  this.BookByCategory = resCategoryData as Book[];

		});
  }
  // set ????? d??i c???a gi??? h??ng
	cartBookLength(CartBook) {
		if (CartBook == null) {
			this.lengthCartBook = 0;
		} else {
			this.lengthCartBook = CartBook.length;
		}
	}
	//get total count and price 
	getTotalCountAndPrice() {
		this.TongTien = 0;
		this.TongCount = 0;
		this.CartBook = JSON.parse(localStorage.getItem("CartBook"));
		this.cartBookLength(this.CartBook);
		if (this.CartBook != null) {
			for (var i = 0; i < this.lengthCartBook; i++) {
				this.TongTien += parseInt((parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count)*(100-this.CartBook[i].sale)/100).toFixed(0));
				this.TongCount += parseInt(this.CartBook[i].count);
			} 
		}
		$('#tongtien').html("&nbsp;" + this.formatCurrency(this.TongTien.toString()));
		$('.cart_items').html(this.TongCount.toString());
		localStorage.setItem("TongTien", this.TongTien.toString());
		localStorage.setItem("TongCount", this.TongCount.toString());
  }
  formatCurrency(number) {
		var n = number.split('').reverse().join("");
		var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
		return n2.split('').reverse().join('') + 'VN??';
	}
}
