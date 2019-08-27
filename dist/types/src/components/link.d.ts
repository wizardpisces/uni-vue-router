import Vue, { CreateElement } from 'vue';
import { Route } from '../type';
export default class RouterLink extends Vue {
    name: string;
    to: Route;
    tag: string;
    replace: Boolean;
    render(h: CreateElement): import("vue").VNode;
}
