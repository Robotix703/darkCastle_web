// Importation de l'outil composant de Angular
import { ContentObserver } from '@angular/cdk/observers';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit } from '@angular/core'
import { PageEvent } from '@angular/material/paginator';

//gestion des abonnements
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FigurinesService } from '../figurine.service';
import { Figurine } from './../figurine.model';

// Définition du composant
@Component({
  //Nom
  selector: 'app-figurine-list',
  //Chemin vers le fichier HTML
  templateUrl: './figurine-list.component.html',
  styleUrls: ['./figurine-list.component.css']
})

// Composant
export class FigurineListComponent implements OnInit, OnDestroy {

  isLoading = false;
  figurines: Figurine[] = [];

  //Système de connexion
  userIsAuthenticated = false;

  pageSizeOptions:number[] = [10, 25, 50, 100];
  pageSize:number = 10;
  length:number = 0;
  currentPage: number = 0;

  userID: string | null = '';
  isDone: boolean = false;
  isFavoris: boolean = false;
  category: string = "";

  categoryList: string[] = [];

  //Abonnement
  private authStatusSub: Subscription = new Subscription;
  private figurinesSub: Subscription = new Subscription;

  constructor(private figurineService: FigurinesService, private authService: AuthService) { }

  ngOnInit() {

    this.userID = this.authService.getUserId();

    this.figurineService.getFigurines(this.pageSize, this.currentPage).subscribe((data) => {
      this.displayFigurines(data.figurines, data.maxFigurines);
    });

    this.figurineService.getCategories()
    .subscribe((data) => {
      this.categoryList = data;
    });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userID = this.authService.getUserId();
    });
  }

  onDelete(figurineID: string) {
    if(!this.figurines || !figurineID) return;
    const figurineName = this.figurines.find((e : Figurine) => e.id == figurineID)?.name;

    if(!figurineName) return;
    if(this.clickMethod(figurineName))
    {
      this.figurineService.deleteFigurine(figurineID).subscribe(() => {
        this.figurineService.getFigurines(this.pageSize, this.currentPage).subscribe((data) => {
          this.displayFigurines(data.figurines, data.maxFigurines);
        });
      });
    }
  }

  displayFigurines(figurines: Figurine[], maxFigurines: number){
    if(figurines && this.userID != null){
      figurines.forEach(element => {
        element.isFavoris = element.favoris ? element.favoris.includes(this.userID as string) : false;
      });
    }

    this.figurines = (figurines)? figurines : [];
    this.length = maxFigurines;
    this.isLoading = false;
    this.currentPage = 0;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }

  getFigurinesData(event?:PageEvent){
    if(!event) return;

    this.figurineService.getFigurines(event.pageSize, event.pageIndex).subscribe((data) => {
      this.displayFigurines(data.figurines, data.maxFigurines);
    });
    this.currentPage = event.pageIndex;
  }

  setFavoris(figurineID: string, isFavoris: boolean){
    if(!this.userID) return;
    this.figurineService.updateFavoris(figurineID, this.userID, !isFavoris)
    .subscribe(() => {
      this.figurineService.getFigurines(this.pageSize, this.currentPage).subscribe((data) => {
        this.displayFigurines(data.figurines, data.maxFigurines);
      });
    });
  }

  setPainted(figurineID: string, isPainted: boolean){
    this.figurineService.updatePainted(figurineID, isPainted)
    .subscribe(() => {
      this.figurineService.getFigurines(this.pageSize, this.currentPage).subscribe((data) => {
        this.displayFigurines(data.figurines, data.maxFigurines);
      });
    })
  }

  selectCategory(selectedCategory: string){
    this.category = selectedCategory;
    const userIDForFavoris = (this.isFavoris) ? this.userID : "";
    this.figurineService.getFilteredFigurines(userIDForFavoris as string, this.isDone, this.category, this.pageSize, this.currentPage).subscribe((data) => {
      this.displayFigurines(data.Figurines, data.maxFigurines);
    })
  }

  toggleFavoris(value: boolean){
    this.isFavoris = value;
    const userIDForFavoris = (this.isFavoris) ? this.userID : "";
    console.log(userIDForFavoris)
    this.figurineService.getFilteredFigurines(userIDForFavoris as string, this.isDone, this.category, this.pageSize, this.currentPage).subscribe((data) => {
      this.displayFigurines(data.Figurines, data.maxFigurines);
    })
  }

  toggleDone(value: boolean){
    this.isDone = value;
    const userIDForFavoris = (this.isFavoris) ? this.userID : "";
    this.figurineService.getFilteredFigurines(userIDForFavoris as string, this.isDone, this.category, this.pageSize, this.currentPage).subscribe((data) => {
      this.displayFigurines(data.Figurines, data.maxFigurines);
    })
  }
}
