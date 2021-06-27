import { Component, OnInit } from "@angular/core";
import { Colors } from "../../../../constants/colors.service";
import { ItemStatus, ItemType } from "../../../../models/enums";
import { DesignService } from "../../../../services/design.service";

@Component({
    selector: "app-image-toolbar",
    templateUrl: "./image-toolbar.component.html",
    styleUrls: ["./image-toolbar.component.scss"],
})
export class ImageToolbarComponent implements OnInit {
    constructor(public ds: DesignService) {}

    activeColor = Colors.getColors().separatorColor;
    ItemType = ItemType;
    ItemStatus = ItemStatus;

    ngOnInit(): void {}
}
