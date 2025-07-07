import { ui } from "../../../utils/ui.js";
import { CreateReplacementList } from "./create-list/index.js";
import { OverviewReplacementList } from "./overview/index.js";

export const Dashboard = (openEditor) => {
  const { div } = ui()
  return div({ class: 'dashboard' }, [
    CreateReplacementList(),
    OverviewReplacementList(openEditor)
  ]);
}