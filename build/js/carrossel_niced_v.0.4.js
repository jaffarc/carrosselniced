
/**
 * [Wapp description]
 * @type {[type]}
 */
var Wapp = Wapp || {};

(function($, d, w) {
    'use strict';

    var
        Wobj = {
            carrossel: '.carrosselniced',
            block: '.carrosselniced .block',
            content: '.carrosselniced .block .content',
            control: '.carrosselniced .control',
            bullet: '.carrosselniced .bullet',
            bulletButton: '.carrosselniced .bullet button',
            line: '.carrosselniced .block .content',
            amount: $('.carrosselniced .block ul').length,
            list: '.carrosselniced .block .content li',
            width: 0,
            height: 0,
            margin: 0,
            prev: '.prev',
            next: '.next',
            buttonHeight: 30, // px
            count: 0,
            interval: {},
            // --------------- animate CSS class
            animateClass: [
                // 'anGrayscale',
                // 'anRotateY',
                // 'anRotateX',
                // 'anOpacity',
                // 'anRotate'
            ]
        };
    
    /**
     * [carrosselNiced description]
     * @type {Object}
     */
    Wapp.carrosselNiced = {};

    /**
     * [Init description]
     * @param {[type]} debug [description]
     */
    Wapp.carrosselNiced.Init = function(debug) {
        if (debug === true) { // objects workspace
            console.log('Wapp: ', Wapp);
            console.log('Wobj: ', Wobj);
            console.log('-----------------------------------------');
        }

        //Wapp.carrosselNiced.CreateId();
        //Wapp.carrosselNiced.Listen();

        // ******************************************
        // FOR V T E X PLATAFORM ONLY
        // ******************************************
        // remove li empty - for carrossel and slider
        // remove setTimeout if plataform not VTEX
        // ******************************************
        $('.helperComplement').remove(); // trash list
        $('.carrosselniced ul li li').remove(); // others trash list

        setTimeout(function () {
            Wapp.carrosselNiced.CreateId();
            Wapp.carrosselNiced.Listen();
        }, 200);
        // ******************************************
    };

    /**
     * [Listen description]
     */
    Wapp.carrosselNiced.Listen = function() {
        $(d).on('click', Wobj.prev, Wapp.carrosselNiced.PrevSet);
        $(d).on('click', Wobj.next, Wapp.carrosselNiced.NextSet);
        $(w).on('resize', Wapp.carrosselNiced.Resize);
        $(d).on('click', Wobj.bulletButton, Wapp.carrosselNiced.ChangeBullet);
    };

    /**
     * [Resize description]
     */
    Wapp.carrosselNiced.Resize = function() {
        Wobj.count = 1;
        Wapp.carrosselNiced.CreateId();
    };

    /**
     * [CreateId description]
     */
    Wapp.carrosselNiced.CreateId = function() { // multiple carrossel
        // not create, disable example
        /*if ($(w).width() <= 550) {
            return false;
        }*/

        $(Wobj.carrossel).each(function(i) {
            $(this).removeAttr('id');
            $(this).attr('id', 'cn' + i);
            Wapp.carrosselNiced.Create('#cn' + i, $(this).attr('data-view'));
        });
    };
    /**
     * [Create description]
     * @param {[type]} id [description]
     * @param {[type]} v  [description]
     */
    Wapp.carrosselNiced.Create = function(id, v) {
        var
            amount = $(id + ' .content li').length,
            element = $(id + ' .content li').first(),
            first = $(id + ' .content li')[0],
            margin = ($(element).outerWidth(true) - $(element).width()) + 1,
            block = $(id + ' .block .content'),
            line = $(id + ' .content li'),
            view = parseInt(v, 0),
            grid = $(id).closest($(id).attr('data-grid')),
            gridWidth = parseInt($(grid).width()),
            responsa = $(id).attr('data-responsa'),
            width = ($(grid).width() / view),
            blockWidth = ($(grid).width() * amount),
            lineWidth = (width - margin),
            percent = '10000%';

        // no create
        if (amount === 1) {
            return false;
        }

        $(first).addClass('selected');

        // for slider
        if (view === 1) {
            // create for bullets
            $(line).each(function(i) {
                $(this).attr('data-pos', i);
            });

            $(block).width(blockWidth);
            $(line).width(width);
            console.log('Create: Slider');

        // for carrossel
        } else {
            // for responsive using data-responsa
            if (responsa) {
                $.each(JSON.parse(responsa), function (i, v) {
                    if (gridWidth < parseInt(i, 0)) {
                        view = parseInt(v, 0);
                        width = (gridWidth / view);
                        blockWidth = (gridWidth * amount);
                        lineWidth = width;

                        return false;
                    }
                });
            }

            $(line).width(lineWidth);
            $(block).width(percent);
            console.log('Create: Carrossel');
        }

        setTimeout(function () {
            Wapp.carrosselNiced.ResetControls(id);
            Wapp.carrosselNiced.Controls(id);
        },500);

        // only first time
        if (Wobj.count === 0) {
            Wapp.carrosselNiced.Continuous(id);
        }
    };
    
    /**
     * [ResetControls description]
     * @param {[type]} id [description]
     */
    Wapp.carrosselNiced.ResetControls = function(id) {
        if (!id) {
            $(Wobj.control).remove();
            $(Wobj.bulletButton).remove();

        } else {
            $(id + ' .control').remove();
            $(id + ' .bullet').remove();
        }
    };

    /**
     * [Controls description]
     * @param {[type]} id [description]
     */
    Wapp.carrosselNiced.Controls = function(id) {
        var
            html = '';

        // navigation
        if ($(id).attr('data-nav') === 'true') {

            var
                height = ($(id + ' .block').height() / 2) - 20, // (carrosel UL height / 2) - (BUTTON height / 2) = center BUTTON
                left = ($(id).attr('data-left') ? '<span class="' + $(id).attr('data-left') + '">' : 'left icon-embed'),
                right = ($(id).attr('data-right') ? '<span class="' + $(id).attr('data-right') + '">' : 'right icon-embed');

            html += '<div class="control" style="margin-top:' + height + 'px;">';
                html += '<button class="prev" data-id="' + id + '">';
                    html += left;
                html += '</button>';
                html += '<button class="next" data-id="' + id + '">';
                    html += right;
                html += '</button>';
            html += '</div>';

            $(id).append(html);
                html = '';
            }

            // bullet only slider
            if ($(id).attr('data-bullet') === 'true') {
                if ($(id).attr('data-view') === '1') {
                    var
                        first;

                    html += '<div class="bullet">';

                // text in bullet
                if ($(id).attr('data-caption') === 'true') {
                    $(id).addClass('caption');

                    $(id + ' .content li').each(function(i) {
                        html += '<button data-pos="' + i + '" data-id="' + id + '">' + $(this).attr('data-title') + '</button>';
                    });

                } else {
                    $(id + ' .content li').each(function(i) {
                        html += '<button data-pos="' + i + '" data-id="' + id + '">' + i + '</button>';
                    });
                }

                html += '</div>';

                $(id).append(html);
                html = '';

                first = $(id + ' .bullet button')[0];
                $(first).addClass('selected');
            }
        }
    };

    /**
     * [Continuous description]
     * @param {[type]} id [description]
     */
    Wapp.carrosselNiced.Continuous = function(id) {
        if ($(id).attr('data-auto') === 'true') {
            Wapp.carrosselNiced.SetInterVal(id);
        }
    };

    /**
     * [SetInterVal description]
     * @param {[type]} id [description]
     */
    Wapp.carrosselNiced.SetInterVal = function(id) {
        Wobj.interval[id.replace('#', '')] = setInterval(function() {
            Wapp.carrosselNiced.Next(id);
        }, $(id).attr('data-delay'));
    };

    /**
     * [Clear description]
     * @param {[type]} id [description]
     */
    Wapp.carrosselNiced.Clear = function(id) {
        clearInterval(Wobj.interval[id.replace('#', '')]);
    };

    /**
     * [PrevSet description]
     * @param {[type]} e [description]
     */
    Wapp.carrosselNiced.PrevSet = function(e) {
        var
            id;

        if ($(e.target).prop('tagName') === 'SPAN') {
            id = $(e.target).parent().attr('data-id');

        } else {
            id = $(e.target).attr('data-id');
        }

        Wapp.carrosselNiced.Clear(id);
        Wapp.carrosselNiced.Prev(e, id);
    };


    /**
     * [Prev description]
     * @param {[type]} e  [description]
     * @param {[type]} id [description]
     */
    Wapp.carrosselNiced.Prev = function(e, id) {
        var
            view = $(id).attr('data-view'),
            len = $(id + ' .content li').length,
            first = $(id + ' .content li')[0],
            last = $(id + ' .content li')[len - 1],
            width = $(id + ' .content li').width(),
            rand = 'noClass',
            transition = 0;

        if ($(id).attr('data-effect') === 'true') {
            rand = Wapp.carrosselNiced.Rand();
        }

        console.log('first', first);
        console.log('last', last);

        transition = $(id).attr('data-transition');
        $(id).addClass(rand);
        $(first).before($(last));

        $(id + ' .content').css('margin-left', '-' + width + 'px');
        $(id + ' .content').stop().animate({
            'margin-left': 0
        }, transition, function() {
            $(id).removeClass(rand);
            $(first).addClass('selected');
            Wapp.carrosselNiced.ChangeSelected(e, id);
        });

        return false;
    };

    /**
     * [NextSet description]
     * @param {[type]} e [description]
     */
    Wapp.carrosselNiced.NextSet = function(e) {
        var
            id;

        if ($(e.target).prop('tagName') === 'SPAN') {
            id = $(e.target).parent().attr('data-id');

        } else {
            id = $(e.target).attr('data-id');
        }

        Wapp.carrosselNiced.Clear(id);
        Wapp.carrosselNiced.Next(id);
    };

    /**
     * [Next description]
     * @param {[type]} e [description]
     */
    Wapp.carrosselNiced.Next = function(e) {
        var
            id,
            len = '',
            first,
            last,
            width = 0,
            rand = 'noClass',
            transition = 0;

        if (typeof(e) === 'string') { // init by FUNCTION[Continuous]
            id = e;

        } else { // init by EVENT[Click]
            id = $(e.target).attr('data-id');
        }

        len = $(id + ' .content li').length;
        first = $(id + ' .content li')[0];
        last = $(id + ' .content li')[len - 1];
        width = $(id + ' .content li').width();
        transition = $(id).attr('data-transition');

        if ($(id).attr('data-effect') === 'true') {
            rand = Wapp.carrosselNiced.Rand();
        }

        $(id).addClass(rand);

        $(id + ' .content').stop().animate({
            'margin-left': '-' + width + 'px'
        }, transition, function() {
            $(id + ' .content').css('margin-left', 0);
            $(last).after($(first));
            $(id).removeClass(rand);
            Wapp.carrosselNiced.ChangeSelected(e, id);
        });
    };

    /**
     * [ChangeBullet description]
     * @param {[type]} e [description]
     */
    Wapp.carrosselNiced.ChangeBullet = function(e) {
        var
            id = $(e.target).attr('data-id'),
            pos = $(e.target).attr('data-pos'),
            amount = $(id + ' .content li').length,
            selected = $(id + ' .content li.selected'),
            element = '',
            first = $(id + ' .content li.selected'),
            last = $(id + ' .content li')[amount - 1],
            width = $(id + ' .content li').width(),
            rand = 'noClass',
            transition = $(id).attr('data-transition');

        if ($(id + ' .content li.selected').attr('data-pos') === pos) {
            return false;
        }

        Wapp.carrosselNiced.Clear(id);

        $(id + ' .content li').each(function() {
            if ($(this).attr('data-pos') === pos) {
                element = $(this);
            }
        });

        if ($(id).attr('data-effect') === 'true') {
            rand = Wapp.carrosselNiced.Rand();
        }

        $(id).addClass(rand);

        $(selected).after($(element));

        $(id + ' .content').stop().animate({
            'margin-left': '-' + width + 'px'
        }, transition, function() {
            $(id).removeClass(rand);
            $(this).css('margin-left', 0);
            $(last).after($(first));
            Wapp.carrosselNiced.ChangeSelected(e, id);
        });
    };

    /**
     * [ChangeSelected description]
     * @param {[type]} e  [description]
     * @param {[type]} id [description]
     */
    Wapp.carrosselNiced.ChangeSelected = function(e, id) {
        var
            first = $(id + ' .content li')[0],
            pos = parseInt($(first).attr('data-pos'), 0),
            bullet = $(id + ' .bullet button')[pos];
            pos = $(e.target).attr('data-pos');

        $(id + ' .content li').removeClass('selected');
        $(id + ' .bullet button').removeClass('selected');
        $(first).addClass('selected');
        $(bullet).addClass('selected');
    };

    /**
     * [Rand description]
     */
    Wapp.carrosselNiced.Rand = function() {
        var
            name = Wobj.animateClass[Math.floor(Math.random() * Wobj.animateClass.length)];

        return name;
    };

    /**
     * [description]
     * @param  {[type]}   
     * @param  {[type]} [description]
     * @return {[type]} [description]
     */
    $(d).ready(function() {
        setTimeout(function() {
            console.log('INIT: C A R R O S S E L N I C E D - V.0.4');
            Wapp.carrosselNiced.Init(true);
        }, 20);
    });

}(jQuery, document, window));