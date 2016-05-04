/*
- -----------------------------------------------------------
- C A R R O S S E L N I C E D - V.0.4 -----------------------
- SLIDER AND CARROSSEL --------------------------------------
- -----------------------------------------------------------
- REQUIRES BASE (Using) -------------------------------------
- [VTEX] jQuery v.1.8 - Recommended jQuery v.1.11.3 ---------
- Font-Awesome //fortawesome.github.io/Font-Awesome ---------
- -----------------------------------------------------------
- Created 08/03/2016 ----------------------------------------
- Update 04/05/2016 -----------------------------------------
- -----------------------------------------------------------
- MOD -------------------------------------------------------
- For client [Vino Italia] ----------------------------------
- Developed in [TOPDEALS - Negócios e Ideias] ---------------
- -----------------------------------------------------------
- FREE FOR ALL NOW ------------------------------------------
- Hey this Free Cultural Works, Libre Niced! ----------------
- More http://creativecommons.org/freeworks -----------------
- -----------------------------------------------------------
- WIZARD FLY ------------------------------------------------
- Adonis Vieira - Analist Front End -------------------------
- http://wizardfly.com.br -----------------------------------
- -----------------------------------------------------------
- I T I S T H E G R E A T E ( w ) I Z A R D W H O F L I E S -
- -----------------------------------------------------------

- -----------------------------------------------------------
# H T M L Structure #
- -----------------------------------------------------------

<div class="full"> //GRID responsive
    <div class="carrosselniced"> // data*attr - more [## CONFIG ##]
        <div class="block">
            <ul class="content">
                <li> // list 01
                    CONTENT
                </li>
                <li> // list 02
                    CONTENT
                </li>
                <li> // list 03
                    CONTENT
                </li>
            </ul>
        </div>
    </div>
</div>

- -----------------------------------------------------------
# C O N F I G #
- -----------------------------------------------------------
- use data-attr in html
- -----------------------------------------------------------

data-view="[number]" // amount list display
data-auto="[boolean]" // automatic animate next (true|false)
data-nav="[boolean]" // create buttons navigation (true|false)
data-bullet="[boolean]" // create bullets navigation (true|false)
data-left="[string]" // 'fontawesome' icon left 'prev' name ex:(fa fa-arrow-circle-o-left)
data-left="[string]" // 'fontawesome' icon right 'next' name ex:(fa fa-arrow-circle-o-right)
data-delay="[number]" // delay seTimeout interval (2500)
data-transition="[number]" // animate speed (650),
data-effect="[boolean]" // enable effects css array (true|false)
data-caption="[boolean]" // enable caption in bullet (true|false)
data-grid="[string]" // responsive grid full (class)
data-responsa="[object]" // responsive values ("viewport":amount) ex:{"890":3,"650":2,"460":1}

- -----------------------------------------------------------
# NOTE #
- -----------------------------------------------------------
- automatic DELETE ".helperComplement" for vtex plataform in DIV ".carrosselniced"
- -----------------------------------------------------------
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

    Wapp.carrosselNiced = {};

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

    Wapp.carrosselNiced.Listen = function() {
        $(d).on('click', Wobj.prev, Wapp.carrosselNiced.PrevSet);
        $(d).on('click', Wobj.next, Wapp.carrosselNiced.NextSet);
        $(w).on('resize', Wapp.carrosselNiced.Resize);
        $(d).on('click', Wobj.bulletButton, Wapp.carrosselNiced.ChangeBullet);
    };

    Wapp.carrosselNiced.Resize = function() {
        Wobj.count = 1;
        Wapp.carrosselNiced.CreateId();
    };

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

    Wapp.carrosselNiced.ResetControls = function(id) {
        if (!id) {
            $(Wobj.control).remove();
            $(Wobj.bulletButton).remove();

        } else {
            $(id + ' .control').remove();
            $(id + ' .bullet').remove();
        }
    };

    Wapp.carrosselNiced.Controls = function(id) {
        var
            html = '';

        // navigation
        if ($(id).attr('data-nav') === 'true') {

            var
                height = ($(id + ' .block').height() / 2) - 20, // (carrosel UL height / 2) - (BUTTON height / 2) = center BUTTON
                left = ($(id).attr('data-left') ? '<span class="' + $(id).attr('data-left') + '">' : 'left'),
                right = ($(id).attr('data-right') ? '<span class="' + $(id).attr('data-right') + '">' : 'right');

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

    Wapp.carrosselNiced.Continuous = function(id) {
        if ($(id).attr('data-auto') === 'true') {
            Wapp.carrosselNiced.SetInterVal(id);
        }
    };

    Wapp.carrosselNiced.SetInterVal = function(id) {
        Wobj.interval[id.replace('#', '')] = setInterval(function() {
            Wapp.carrosselNiced.Next(id);
        }, $(id).attr('data-delay'));
    };

    Wapp.carrosselNiced.Clear = function(id) {
        clearInterval(Wobj.interval[id.replace('#', '')]);
    };

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

    Wapp.carrosselNiced.Rand = function() {
        var
            name = Wobj.animateClass[Math.floor(Math.random() * Wobj.animateClass.length)];

        return name;
    };

    $(d).ready(function() {
        setTimeout(function() {
            console.log('INIT: C A R R O S S E L N I C E D - V.0.4');
            Wapp.carrosselNiced.Init(true);
        }, 20);
    });

}(jQuery, document, window));