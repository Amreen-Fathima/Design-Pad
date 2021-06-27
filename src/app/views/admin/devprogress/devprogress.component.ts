import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-devprogress',
  templateUrl: './devprogress.component.html',
  styleUrls: ['./devprogress.component.scss'],
})
export class DevprogressComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  milestones: Milestone[] = [
    {
      totalHours: 20,
      description: 'Milestone 1',
      items: [
        {
          title: 'Project setup (Choose project theme and purchase)',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Basic Routing',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Authentication (email, google, facebook)',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'only free membership for user',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Admin site setup',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'only super membership for admin',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Cloud setup, deploy backend, frontend, admin',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
      ],
    },
    {
      totalHours: 20,
      description: 'Milestone 2',
      items: [
        {
          title: 'Admin upload image files (these files will appear in the photos category for user site)',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'upload user specific image assets',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Main edit panel: User can create place image on edit-template panel and edit it',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Browse photos using tags',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Zoom Fit Fill Percentage feature',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
      ],
    },
    {
      totalHours: 20,
      description: 'Milestone 3',
      items: [
        {
          title: 'Crop Functionality',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Place & Edit content',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Scale & setting width by dragging',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Font Sizing',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Bold Italic Underlined Uppercase',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Text alignment & liststyling',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Letter spacing & Line height Panel',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Color panel: Color picker for custom colors',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Color panel: default colors',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Effect panel: Shadow, Lift',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Effect panel: other 6',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Color panel: Color picker for custom colors',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Font: Google font picker with preview',
          hours: 2,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Text: Font: Apply font by clicking',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
      ],
    },
    {
      totalHours: 50,
      description: 'Milestone 4',
      items: [
        {
          title: 'Browse SVG elements',
          hours: null,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'main/Edit SVG elements',
          hours: null,
          note: '',
          date: null,
          isDone: true,
        },

        {
          title: 'Download as PNG, JPG',
          hours: 1,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Download as PDF',
          hours: 2,
          note: '',
          date: null,
          isDone: true,
        },
        {
          title: 'Download as SVG',
          hours: null,
          note: '',
          date: null,
          isDone: true,
        },

        {
          title: 'Undo and Redo',
          hours: null,
          note: '',
          date: null,
          isDone: true,
        },
      ],
    },
    {
      totalHours: 50,
      description: 'Milestone 5',
      items: [
        {
          title: 'Fix image download & backspace issue',
          hours: 4,
          note: '',
          date: null,
          isDone: false,
        },
        {
          title: 'My Template: Browse with Preview',
          hours: 4,
          note: '',
          date: null,
          isDone: false,
        },
        {
          title: 'My Template: Load & Apply by click',
          hours: 4,
          note: '',
          date: null,
          isDone: false,
        },
        {
          title: 'Admin Upload Tempate',
          hours: null,
          note: '',
          date: null,
          isDone: false,
        },
        {
          title: 'Browse Template',
          hours: null,
          note: '',
          date: null,
          isDone: false,
        },
      ],
    },
    {
      totalHours: 50,
      description: 'Milestone 6',
      items: [
        {
          title: 'Music browse and edit',
          hours: null,
          note: '',
          date: null,
          isDone: false,
        },
        {
          title: 'Video browse and edit',
          hours: null,
          note: '',
          date: null,
          isDone: false,
        },
        {
          title: 'Download as MP4, GIF',
          hours: null,
          note: '',
          date: null,
          isDone: false,
        },
      ],
    },
  ];

  reports: Report[] = [
    {
      description: 'Dec 1 bug list',
      bugs: [
        {
          title: 'Give a delete option once an image has been moved to the canvas.',
          isDone: true,
        },
        {
          title: 'we need the edit filters options as well for the images.',
          isDone: true,
        },
        {
          title:
            'In terms of user experience, let the user be able to drag the image only by holding "cmd/cntl" , right now the user can drag the image, just after a single click on the image.',
          isDone: true,
        },
        {
          title: 'The tagging feature is functioning.',
          isDone: true,
        },
        {
          title: 'I am not able to add images to a new page "page 2" that i created using "Add page".',
          isDone: true,
        },
        {
          title:
            'After clicking on the images from the left images list, it takes some time to load into the canvas, can we have some loading message or gif.',
          isDone: true,
        },
        {
          title: 'There is a gap in the images list, can we implement pinterest kind of CSS for the images list.',
          isDone: true,
        },
      ],
    },
    {
      description: 'Dec 10 bug list',
      bugs: [
        {
          title: ` As you can see above, the gap between the icons and the images loaded is uniformly spaced, the search bar comes with a close tag once you start typing.
                  Use a dark grey background (#293039) for the images right now its white. Alignment of images needs to be uniform`,
          isDone: true,
        },
        {
          title: `Give an auto suggest as seen in canva for the search bar`,
          isDone: true,
        },
        {
          title: `The top header as mentioned earlier in my previous email, reduce the height and make the banner color a gradient. https://uigradients.com/#Celestial (#34e89e -> #0f3443)`,
          isDone: true,
        },
        { title: `Login with facebook is not working`, isDone: true },
        {
          title: `Drag drop of images into the canvas is not working, only clicking on the image is working.`,
          isDone: true,
        },
        { title: `Click once drag issue has to be fixed`, isDone: true },
        {
          title: `Flipx/Flipy needs to be according to canva. (Flip horizontal / vertical) drop down menu.`,
          isDone: true,
        },
        { title: `Cropping of image feature. `, isDone: true },
        {
          title: ` remove this icon and make the site as 2nd one of the light theme as default `,
          isDone: true,
        },
      ],
    },
  ];
}

interface Report {
  description: string;
  bugs: Bug[];
}

interface Bug {
  title: string;
  isDone: boolean;
}

interface Milestone {
  totalHours: number;
  description: string;
  items: MilestoneItem[];
}

interface MilestoneItem {
  title: string;
  hours: number;
  note: string;
  date: Date;
  isDone: boolean;
}
