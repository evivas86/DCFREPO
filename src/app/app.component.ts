import { Component, OnInit } from "@angular/core";
import { MockService } from "./services/mock.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "CodeSandbox";

  constructor(private mockService: MockService) {}

  ngOnInit() {
    this.mockService.showPhrase();
  }
}
