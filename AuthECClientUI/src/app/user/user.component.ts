import { Component } from '@angular/core';
import { RegistrationComponent } from './registration/registration.component';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query } from '@angular/animations';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './user.component.html',
  styles: ``,
  animations:[
    trigger('routerFadeIn',[
      transition('* <=> *',[
        query(':enter',[
          style({opacity:0}),
          animate('0.5s ease-in', style({opacity:1}))
        ], {optional:true})
      ])
    ])
  ]
})
export class UserComponent {

  constructor(private context: ChildrenOutletContexts) { }

  getRouterUrl()
  {
    return this.context.getContext('primary')?.route?.url;
  }
}
