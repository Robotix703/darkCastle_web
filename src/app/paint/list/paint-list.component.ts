// Importation de l'outil composant de Angular
import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';

//gestion des abonnements
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Color } from 'src/app/color/color.model';
import { Instruction } from '../paint.model';
import { PaintsService } from '../paint.service';
import { ColorsService } from 'src/app/color/color.service';

// Définition du composant
@Component({
  //Nom
  selector: 'app-paint-list',
  //Chemin vers le fichier HTML
  templateUrl: './paint-list.component.html',
  //Chemin vers le fichier CSS
  styleUrls: ['./paint-list.component.css']
})

@Injectable({ providedIn: "root" })

// Composant
export class PaintListComponent implements OnInit, OnDestroy {

  //Liste des instructions
  instructions: any[] = [];

  //Nombre d'instructions
  totalInstructions = 0;

  //ID de la figurine
  figurineID: string | null = "";

  //Système de connexion
  userIsAuthenticated = false;
  userId: string | null = null;

  //Abonnement
  private authStatusSub: Subscription = new Subscription;
  private instructionsSub: Subscription = new Subscription;
  private colorsSub: Subscription = new Subscription;

  //Créé un membre de la classe de type PostService
  constructor(private paintService: PaintsService,
    public ColorsService: ColorsService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef) { }

  displayedColumns: string[] = ['name', 'gamme', 'drawerName', 'positionX', 'positionY'];
  //dataSource = ELEMENT_DATA;
  dataSource: any[] = [];

  compare = function(a: any, b: any){
    if ( a.step < b.step ){
      return -1;
    }
    if ( a.step > b.step ){
      return 1;
    }
    return 0;
  }

  //Exécuté à l'init
  ngOnInit() {
    //Demande de récupération des figurines
    //Paramètres passés dans l'URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //Recherche de la présence d'un ID
      if (paramMap.has("figurineID")) {
        this.figurineID = paramMap.get('figurineID');
        if(this.figurineID == null) return;
        this.paintService.getInstructions(this.figurineID);
      }
    });

    this.instructionsSub = this.paintService.getInstructionUpdateListener()
      .subscribe((instructionData: { instructions: Instruction[], maxInstructions: number }) => {
        this.instructions = instructionData.instructions.sort(this.compare);
        this.totalInstructions = instructionData.maxInstructions;

        this.ColorsService.getColors();
      });

    this.colorsSub = this.ColorsService.getColorUpdateListener()
      .subscribe((colorData: { color: Color[] }) => {

        let instructionColor = [];

        //Parcours des instructions
        for (let i = 0; i < this.instructions.length; i++) {

          instructionColor = [];

          if (this.instructions[i].paintID == "") {
            let emptyColor = { id: "", name: "", gamme: "", drawerName: "", positionX: "", positionY: "" };
            instructionColor.push(emptyColor)
          }
          else {
            for (let j = 0; j < this.instructions[i].paintID.length; j++) {
              instructionColor.push(colorData.color.find(e => e.id === this.instructions[i].paintID[j]))
            }
          }

          this.instructions[i].paintColor = [...instructionColor];
        }

        this.dataSource = instructionColor;
        this.changeDetectorRefs.detectChanges();
      })

    //Première mise à jour de l'état de connexion
    this.userIsAuthenticated = this.authService.getIsAuth();

    //Abonnement au système de connexion
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(instructionID: string) {
    const instructionName = this.instructions.find(e => e.id == instructionID)?.name;
    if(this.clickMethod(instructionName) && this.figurineID)
    {
      this.paintService.deleteInstruction(instructionID).subscribe(() => {
        this.paintService.getInstructions(this.figurineID as string);
      });
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }
}
