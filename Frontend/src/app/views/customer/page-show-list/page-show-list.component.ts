import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { BookService } from '../../../app-services/book-service/book.service';
import { Book } from '../../../app-services/book-service/book.model';
import { CategoryService } from '../../../app-services/category-service/category.service';
import { Category } from '../../../app-services/category-service/category.model';
import { Session } from 'protractor';
import { AuthorService } from '../../../app-services/author-service/author.service';
import { Author } from '../../../app-services/author-service/author.model';
import { FormGroup, FormControl } from '@angular/forms';
import { BookFiter } from '../../../app-services/book-service/bookfilter.model';
import { SocialAccount } from 'src/app/app-services/socialAccount-service/socialaccount.model';
import { CartBookService } from 'src/app/app-services/cartBook-service/cartBook.service';
import { CartBook } from 'src/app/app-services/cartBook-service/cartBook.model';
//favorite
import { Favorite } from 'src/app/app-services/favorite-service/favorite.model';
import { FavoriteService } from 'src/app/app-services/favorite-service/favorite.service';
declare var $: any
@Component({
  selector: 'app-page-show-list',
  templateUrl: './page-show-list.component.html',
  styleUrls: ['./page-show-list.component.css']
})
export class PageShowListComponent implements OnInit {
 
  pageOfItems: Array<any>;
  books: Array<Book> = new Array<Book>();


  bookFilter: BookFiter = new BookFiter();
  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  cartBookDB: CartBook = new CartBook;
  constructor(private _router: Router,private route: ActivatedRoute, private bookService: BookService, private authorService: AuthorService,
    private bookCategoryService: CategoryService, private _cartBookDB: CartBookService,private _favoriteService:FavoriteService) {
  }
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));

  id = this.route.snapshot.paramMap.get('id');
  namefilter = this.route.snapshot.paramMap.get('name');
  favorite: Favorite = new Favorite
  listFavorite :any
  nameShow=""
  ngOnInit() {
    this.getAllFavoriteByUserId();
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    //set ????? d??i cartBook
    this.cartBookLength(this.CartBook);
    //set value gi??? h??ng tr??n thanh head 
    this.getTotalCountAndPrice();
    if(this.namefilter=="category"){
      this.getBookByCategoryId(this.id)
      this.getNameCategroy(this.id)
    }else
    if(this.namefilter=="author"){
      this.getBookByAuthorId(this.id)
      this.getNameAuthor(this.id)
    }else
    if(this.namefilter=="sale"){
      this.getBookSale()
      this.nameShow = "S??ch Gi???m Gi??"
    }
    
  
  }
  getBookSale(){
    this.bookService.getBookSale().subscribe(ListBook=>{
      this.books=ListBook as Book[]
    })
  }
getBookByCategoryId(id){
this.bookService.getBookByCategoryId(id).subscribe(ListBook=>{
  this.books = ListBook as Book[]

})
}
getBookByAuthorId(id){
  this.bookService.getBookByAuthorId(id).subscribe(ListBook=>{
    this.books = ListBook as Book[]

  })
  }
  getNameAuthor(id){
    this.authorService.getAuthorById(id).subscribe(anAuthor=>{
      console.log(anAuthor["nameAuthor"])
      console.log(1231)
      this.nameShow = anAuthor["nameAuthor"]
    })
  }
  getNameCategroy(id){
    this.bookCategoryService.getCategoryById(id).subscribe(aCategory=>{
      this.nameShow =aCategory["nameCategory"]
    })
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
    //n???u s??ch kh??ng c?? trong cartbook ( ch??a t???ng th??m v??o gi???)

  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
  selectedBook = [];
  detailBook(book: Book) {
    return this._router.navigate(['/bookDetail/' + `/${book._id}`]);

  }



  getid_book(id) {
    localStorage.setItem('book_detail', id);
  }









  change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
  }


  addABook = "";
  //add to cart (BookDetail,CountSelect)
  // s??? l?????ng t???i ??a ch??? ???????c 10 m???i qu???n s??ch , t??nh lu??n ???? c?? trong gi???

  checkedAddBook = true;
  addToCart(selectedBook: Book) {
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

  //get total count and price 
  TongTien = 0;
  TongCount = 0;
  CartBook = [];
  lengthCartBook = 0;
  getTotalCountAndPrice() {
    this.TongTien = 0;
    this.TongCount = 0;
    this.CartBook = JSON.parse(localStorage.getItem("CartBook"));
    this.cartBookLength(this.CartBook);
    if (this.CartBook != null) {
      for (var i = 0; i < this.lengthCartBook; i++) {
        this.TongTien += parseInt((parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count) * (100 - this.CartBook[i].sale) / 100).toFixed(0));
        this.TongCount += parseInt(this.CartBook[i].count);

      }
    }
    $('#tongtien').html("&nbsp;" + this.formatCurrency(this.TongTien.toString()));
    $('.cart_items').html(this.TongCount.toString());
    localStorage.setItem("TongTien", this.TongTien.toString());
    localStorage.setItem("TongCount", this.TongCount.toString());
  }
  //#endregion
  formatCurrency(number) {
    var n = number.split('').reverse().join("");
    var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
    return n2.split('').reverse().join('') + 'VN??';
  }
  // set ????? d??i c???a gi??? h??ng
  cartBookLength(CartBook) {
    if (CartBook == null) {
      this.lengthCartBook = 0;
    } else {
      this.lengthCartBook = CartBook.length;
    }
  }

  // go to cart book
  goToCartBook() {
    this._router.navigate(['/cartBook']);
  }

  startPage: Number;
  paginationLimit: Number;

  startPageCategories: Number;
  paginationLimitCategories: Number;
  showMoreItems() {
    this.paginationLimit = this.authorService.authors.length;
  }
  showLessItems() {
    this.paginationLimit = 5;
  }
  showMoreCategories() {
    this.paginationLimitCategories = this.bookCategoryService.categories.length;
  }
  showLessCategories() {
    this.paginationLimitCategories = 5;
  }

  postCartBookDB(selectedBook: Book) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
      this.cartBookDB.userID = this.accountSocial._id;
      this.cartBookDB.bookID = selectedBook._id;
      this.cartBookDB.count = selectedBook.count;
      this._cartBookDB.postCartBook(this.cartBookDB).subscribe(
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
      this._cartBookDB.putCartBook(this.cartBookDB).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
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
    }
  )
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

}
