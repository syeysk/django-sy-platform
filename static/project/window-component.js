WindowComponent = {
    props: ['title'],
    emits: ['close'],
    template: `
        <div class="windowWindow">
            <div class="windowTitle">
                <div class="windowBClose" title="Закрыть окно" @click="close">X</div>
                <div class="windowTitleText">[[ title ]]</div>
            </div>
            <div class="windowBody" style="display: block;"><slot/></div>
        </div>
    `,
    mounted() {
        this.$el.style.display = 'block';
        this.calcPosition('center');
        let wTitle = this.$el.querySelector('.windowTitle');
        DND(wTitle, {
            down: function(e, data) {
                if (data['isSensorDisplay'] && e.touches) e = e.touches[0];
                // необязательны, без них курсор будет смещаться к углу захватываемого объекта
                data['shiftX'] = e.clientX - data['wTitle'].getBoundingClientRect().left;
                data['shiftY'] = e.clientY - data['wTitle'].getBoundingClientRect().top;
                if (self.zi) self.zi.lift(data['w'], 'top')
            },
            move: function(e, data) {
                if (data['isSensorDisplay'] && e.touches) e = e.touches[0];
                var left = e.clientX - data['shiftX'];
                var top = e.clientY - data['shiftY'];
                var screen_width  = document.documentElement.clientWidth-parseInt(getComputedStyle(data['wTitle']).width);
                var screen_height = document.documentElement.clientHeight-parseInt(getComputedStyle(data['wTitle']).height);
                if (left < 0) {left = 0;}
                else if (left > screen_width) {left = screen_width; }
                data['w'].style.left = left+ "px";
                if (top < 0) {top = 0;}
                else if (top > screen_height) {top = screen_height; }
                data['w'].style.top = top + "px";
            },
            data: {
                wTitle: wTitle,
                w: this.$el,
            }
        })
    },
    methods: {
        close(event) {
            let w = this.$el;
            w.style.transition = 'opacity 0.4s';
            w.style.opacity = '0';
            let self = this;
            setTimeout(function() {
                self.$emit('close', this);
                //w.remove();
            }, 400);
        },
        calcPosition(position) {
            let w = this.$el;
            if (position == 'center') {
                var left = (document.documentElement.clientWidth - parseInt(getComputedStyle(w).width)) / 2;
                var top = (document.documentElement.clientHeight - parseInt(getComputedStyle(w).height)) / 2;
                w.style.left = (left >= 0 ? left : 0)+"px";
                w.style.top = (top >= 0 ? top : 0)+"px";
            } else if (position == 'random') {
                w.style.left = (5+Math.random()*6)+"%";
                w.style.top  = (30+Math.random()*3)+"%";
            } else if (typeof position == 'object') {
                var left = position[0] > document.documentElement.clientWidth -  position[0] ? position[0] - parseInt(getComputedStyle(w).width) :  position[0];
                var top =  position[1] > document.documentElement.clientHeight - position[1] ? position[1] - parseInt(getComputedStyle(w).height) : position[1];
                w.style.left = left+'px';
                w.style.top  = top+'px';
            }
        },
    },
}
