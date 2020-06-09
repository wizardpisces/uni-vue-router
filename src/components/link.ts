import { Prop } from 'vue-property-decorator';
import Vue, { CreateElement } from 'vue';
import { Route } from '../type/router';

export default class RouterLink extends Vue {
    name = 'router-link';

    @Prop({
        required: true,
    })
    to!: Route;

    @Prop({
        required: true,
    })
    tag: string = 'navigator';

    @Prop()
    replace: Boolean = false;

    render(h: CreateElement) {
        const router = this.$router;
        const current = this.$route;
        const { pathname, search } = this.$router.resolve(this.to);
        let data: any = {};

        if (this.tag === 'navigator') {
            if (this.replace) {
                data.redirect = true;
            }
            data.url = `${pathname}${search}`;
        }

        console.log('router link:', data);

        return h(this.tag, data, this.$slots.default);
    }
}
