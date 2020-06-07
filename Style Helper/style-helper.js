/*jshint esversion: 10 */


// TODO:
//       Cache Helpers between sessions
//        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
//        https://github.com/marcuswestin/store.js/blob/master/plugins/update_test.js
//       Add colorPicker functionality
//       Add Color settings functionality
//        https://seballot.github.io/spectrum/#modes-input
//        https://github.com/PitPik/colorPicker
//        http://www.dematte.at/colorPicker/
//       Add export css functionality
//       Add multiple select functionality
//       Add font flame iframe
//       Disable header click on arrow click
//       Load files via js
//       Cache/Load user settings json
//       Selector path on hover with selector input


$(document).ready(function() {


  loadExternalFiles = function(url) {
    var wf = document.createElement('script');
    wf.src = url;
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  };

  function HelperContainer(properties) {

    this.itemCounter = 0;
    this.newStyles = [];
    this.helpers = [];


    this.css = properties.styles || this.importHelperStyles;
    this.container = document.createElement('section');
    this.container.id = "helper__container";
    this.container.class = " ui-accordion-header-collapsed";
    this.container.display = "flex";
    this.container.flexDirection = "column";
    this.container.zIndex = 10000;
    this.container.position = "absolute";
    this.container.top = 0;
    this.container.right = 0;
    this.scale = 1;
    this.styleIndexCounter = 0;
    this.autoCompleteData = [];

    // <i class="fas fa-user-cog"></i>
    // <i class="fas fa-info-circle helper__toolbar__icon helper__tooltip" title=""></i>
    this.container.innerHTML =
      `
      <section id="helper__settings__container" class="helper">

        <i class="far fa-times-circle helper__toolbar__icon"></i>

        <section id="helper__settings__nav">
          <span id="helper__settings__import__css__btn" class="helper__settings__btn helper__current__setting">Import CSS</span>
          <span id="helper__settings__color__btn" class="helper__settings__btn">Color</span>
          <span id="helper__settings__user__btn" class="helper__settings__btn">User <i class="fas fa-user-cog"></i></span>
        </section>

        <section id="helper__css__import__container" class="helper__setting">
          <span id="helper__import__css__header">Import CSS files for Autocomplete <i class="fas fa-info-circle helper__toolbar__icon" id="helper__import__css__tooltip" title="The selected files' selectors, property values, and variables will be added to help autocomplete helper form filling."></i></span>
          <input type="file" name="file[]" id="helper__css__import__input" class="inputfile" data-multiple-caption="{count} files selected" multiple="" accept="text/plain, .css">
          <label for="file">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
            <span>Choose File(s)</span>
          </label>
          <ul id="helper__css__files"></ul>
        </section>

        <section id="helper__color__settings__container" class="helper__setting">
          <fieldset id="helper__color__format__fieldset">
            <legend>Color Format: <i class="fas fa-info-circle helper__toolbar__icon" id="helper__color__tooltip" title="Default color value type from color picker and css export."></i></legend>
            <label for="helper__hex__input">Hex</label>
            <input class="helper__settings__checkbox" type="radio" name="helper__hex__input" id="helper__hex__input" checked>
            <label for="helper__rgb__input">RGB/A</label>
            <input class="helper__settings__checkbox" type="radio" name="helper__hex__input" id="helper__rgb__input">
            <label for="helper__hsv__input">HSV</label>
            <input class="helper__settings__checkbox" type="radio" name="helper__hex__input" id="helper__hsv__input">
            <label for="helper__hsl__input">HSL</label>
            <input class="helper__settings__checkbox" type="radio" name="helper__hex__input" id="helper__hsl__input">
          </fieldset>
          <fieldset id="helper__color__picker__fieldset">
            <legend>Color Picker: </legend>
            <label for="helper__spectrum__input">Spectrum <i class="fas fa-info-circle helper__toolbar__icon" id="helper__spectrum__tooltip" title="Color Picker used by Google"></i></label>
            <input class="helper__settings__checkbox" type="radio" name="helper__spectrum__input" id="helper__spectrum__input" checked>
            <label for="helper__colorPicker__input">colorPicker <i class="fas fa-info-circle helper__toolbar__icon" id="helper__colorPicker__tooltip" title="Developmental Color Picker"></i></label>
            <input class="helper__settings__checkbox" type="radio" name="helper__spectrum__input" id="helper__colorPicker__input" disabled>
          </fieldset>
        </section>

      </section>


      <section id="helper__toolbar">
        <i class="fas fa-tools helper__toolbar__icon" title="Settings"></i>
        <section id="helper__visibility__mode">
          <i class="far fa-eye helper__toolbar__icon" title="Hide"></i>
          <i class="far fa-eye-slash helper__toolbar__icon" title="Show"></i>
        </section>
        <section id="helper__zoom__mode">
          <i class="fas fa-search-minus helper__toolbar__icon" title="Zoom Out"></i>
          <i class="fas fa-search-plus helper__toolbar__icon" title="Zoom In"></i>
        </section>
        <section id="helper__export__mode">
          <i class="fas fa-file-code helper__toolbar__icon" title="Export current Helper styles as CSS"></i>
          <i class="fas fa-clipboard-check helper__toolbar__icon" title="Copied"></i>
        </section>
        <section id="helper__lock__mode">
          <i class="fas fa-lock helper__toolbar__icon" title="Unlock Position"></i>
          <i class="fas fa-lock-open helper__toolbar__icon" title="Lock Position"></i>
        </section>
        <section id="helper__font__import__mode">
          <i class="fas fa-paragraph helper__toolbar__icon" title="Import Google Fonts"></i>
          <section id="helper__font__import__container">
            <ul id="helper__imported__fonts"></ul>
            <h3 class="helper__header">Google Font Import Status</h3>
            <span id="helper__import__font__btn">Import</span>
            <input id="helper__fonts__input" class="form-styling" type="text" name="fonts" placeholder="'Droid Sans', 'Droid Serif', etc."/>
            <label for="fonts">Google Font Name(s)  </label>

            <i class="far fa-times-circle helper__toolbar__icon"></i>

          </section>
        </section>
        <section id="helper__toolbar__spectrum__container">
          <i class="fas fa-palette helper__toolbar__icon" title="Color Picker"></i>
          <input id="color-picker" value='#276cb8' />
        </section>

      </section>
      <ul id="blank__helper__container"><h3 class="helper__header">Helper Template </h3><li id="blank__helper" class="ui-state-highlight blank__helper__form">
        <section class="helper__element  helper_element_container">
          <section class="helper__form__container">
            <form class="helper__form">
              <section class="helper__type">
                <input type="checkbox" id="checkbox" class="checkbox form-styling"/>
                <label for="checkbox" ><span class="ui"></span>CSS Selector or CSS variable </label>
              </section>

              <section class="selector">
                <label for="selectors">Selector(s)</label>
                <input class="form-styling" type="text" name="selectors" placeholder="EG: body, #id, .class"/>

                <label for="attribute">Attribute</label>
                <input class="form-styling helper__input__attr" type="text" name="attribute" placeholder="EG: color, backgroundColor, font, etc"/>

                <label for="style">Style</label>
                <input class="form-styling input helper__input__style" type="text" name="style" placeholder="EG: rgba(1,2,3,1) or 'Open Sans', sans-serif, or 1rem, etc. "/>
              </section>
              <section class="variable" style="display: none">
                <label for="variable name">Variable(s)</label>
                <input class="form-styling" type="text" name="variable name" placeholder="--css-var1, --css-var2"/>

                <label for="style-var">Style</label>
                <input class="form-styling input" type="text" name="style-var" placeholder="EG: rgba(1,2,3,1) or 'Open Sans', sans-serif, or 1rem, etc. "/>

              </section>

            </form>

            <section class="helper__btn__container">
              <span class="add__helper__attr__btn">Add Style</span>
              <span class="add__helper__btn">Done</span>
            </section>
          </section>

          <section class="helper__element__styles">
            <h3 class="helper__header">
            <label for="helper name">Helper Name</label>
            <input id="helper__name__input" class="form-styling input helper__input__style" type="text" name="helper name" placeholder="Enter a name for your Helper" value="Helper1"/>
            </h3>
            <section class="helper__styles__list__container" id="hslc">
              <ul class="helper__styles__list"></ul>
            </section>
          </section>

        </section>
      </li></ul>

      <ul id="helper__sortable" class=""></ul>

      `;

    $("body").append(this.container);
  }

  function HelperStyle(inputs, leftArrow, rightArrow, minusCircle, header) {
    this.selector = null;
    this.attribute = null;
    this.style = null;
    if (inputs.length > 3) {
      // Selector, Attribute, Style
      this.selector = inputs[1].value;
      this.attribute = inputs[2].value;
      this.style = inputs[3].value;
    } else {
      // CSS variable, Style
      this.selector = inputs[1].value;
      this.attribute = null;
      this.style = inputs[2].value;
    }
    this.leftArrow = leftArrow;
    this.rightArrow = rightArrow;
    this.minusCircle = minusCircle;
    this.header = header;
    this.styleIndexCounter = null;

  }

  function Helper(helperStylesList, leftArrow, rightArrow, minusCircle, header) {
    this.listOfStyles = helperStylesList;
    this.currentIndex = 0;
    this.propertiesLength = this.listOfStyles.length;

    this.deletedStyleIndexes = new Set();
    this.leftArrow = leftArrow;
    this.rightArrow = rightArrow;
    this.minusCircle = minusCircle;
    this.headerContainer = header;
    this.leftClickBool = false;
    this.rightClickBool = false;
  }

  Helper.prototype.setup = function() {
    let helper = this;

    for (let i = 0; i < this.propertiesLength; i++) {
      helper.listOfStyles[i].styleIndexCounter = i;
    }

    $(this.headerContainer).mouseenter(function() {
      if (helper.propertiesLength > 1) {
        $(helper.leftArrow).click(function() {
          if (!helper.leftClickBool) {
            helper.leftClickBool = true;
            setTimeout(function() {
              helper.leftClickBool = false;
            }, 250);
            // Iterate backwards
            helper.iterate(-1);
            helper.applyStyle();
          }
        });
        $(helper.rightArrow).click(function() {
          if (!helper.rightClickBool) {
            helper.rightClickBool = true;
            setTimeout(function() {
              helper.rightClickBool = false;
            }, 250);
            // Iterate backwards
            helper.iterate(1);
            helper.applyStyle();
          }
        });
      } else {
        $(helper.leftArrow).click(function() {
          helper.applyStyle();
        });
        $(helper.rightArrow).click(function() {
          helper.applyStyle();
        });
      }

      // Remove entire helper element
      $(this).children(".fa-minus-circle").click(function() {
        $(helper.minusCircle).parent().parent().remove();
      });

      // Remove individual style from helper
      $(this).parent().children(".helper__styles__list__container").children(".helper__styles__list").children(".helper__element__styles").children(".helper__header").mouseenter(function() {
        $(this).children(".fa-minus-circle").click(function() {

          let deletedStyleText = $(this).parent().text();

          for (let i = 0; i < helper.propertiesLength; i++) {
            if (deletedStyleText.search(helper.listOfStyles[i].selector) != '-1' && deletedStyleText.search(helper.listOfStyles[i].style) != '-1') {
              helper.deletedStyleIndexes.add(helper.listOfStyles[i].styleIndexCounter);
              $(this).parent().parent().remove();
              // If no more styles, remove helper;
              if (helper.deletedStyleIndexes.size == helper.propertiesLength) {
                $(helper.minusCircle).parent().parent().remove();
              }
              break;
            }
          }
        });
      });
    });

    helper.applyStyle();
  };

  Helper.prototype.iterate = function(direction) {
    let nextPosition = null;
    this.currentIndex += direction;
    let defaultExit = 0;
    while (nextPosition == null && defaultExit < this.propertiesLength) {
      defaultExit++;
      if (this.currentIndex < 0) {
        this.currentIndex = this.propertiesLength - 1;
      } else if (this.currentIndex >= this.propertiesLength) {
        this.currentIndex = 0;
      }
      if (this.deletedStyleIndexes.has(this.currentIndex)) {
        this.currentIndex += direction;
        continue;
      } else {
        return true;
      }
    }
    return false;
  };

  Helper.prototype.applyStyle = function() {
    try {
      let currentStyle = this.listOfStyles[this.currentIndex];
      let currentSelector = currentStyle.selector + '';
      let currentStyleStyle = currentStyle.style + '';
      let currentAttribute = currentStyle.attribute;
      if (currentStyle.attribute == null) {
        // CSS Variable
        $("body").get(0).style.setProperty(currentSelector, currentStyleStyle);
      } else {
        // selector
        currentAttribute += '';
        $(currentSelector).not("#helper__container, #helper__container > *, #helper__container > * > *, #helper__container > * > * > *, #helper__container > * > * > * > *, #helper__container > * > * > * > * > *, #helper__container > * > * > * > * > * > *, #helper__container > * > * > * > * > * > * > *").css(
          currentAttribute, currentStyleStyle
        );
      }
    } catch {
      return false;
    }
  };


  HelperContainer.prototype.importHelperStyles = function() {
    this.styles = HELPER__STYLES = ` `;
    this.userStyleSheets = null;
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = HELPER__STYLES;
    } else {
      style.appendChild(document.createTextNode(HELPER__STYLES));
    }
    return HELPER__STYLES;
  };

  HelperContainer.prototype.copyToClipboard = function() {
    // Create a dummy input to copy the string array inside it
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    // CSS export value
    document.getElementById("dummy_id").value = "Copied";
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  HelperContainer.prototype.setup = function() {
    let helper = this;
    helper.loadLibraries();
    helper.zoomControlSetup();
    helper.setupUI();
    helper.loadGoogleFonts();
    helper.setupCaching();

  };

  HelperContainer.prototype.setupCaching = function() {
    let targetProxy = new Proxy(this.helpers, {
      set: function (target, key, value) {
          console.log(`${key} set to ${value}`);
          target[key] = value;
          return true;
      }
    });

  };

  HelperContainer.prototype.loadGoogleFonts = function() {
    $.getJSON( "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAuTeB2eCCWNsgggRturAURn1a0a_CnOKw", function( data ) {
      var fonts = [];
      $.each( data, function( key, val ) {
        if (key == "items"){
          for(let i = 0; i < val.length; i++) {
            fonts.push({
              "label": val[i].family,
              "category": val[i].category
            });
          }
        }

      });
      console.log(fonts);
      $("#helper__fonts__input").autocomplete({
        source: fonts,
        autoFocus: true
      });
    });
  };


  HelperContainer.prototype.getPageStyles = function(uploadedFiles) {
    let helper = this;
    let css = [];
    // let files = $("#helper__css__import__input")[0].files;
    let files = uploadedFiles;
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      $("#helper__css__files").append("<li class='helper__css__file'>" + `<span class='helper__css__import__icon'>${(loadingCompleteSVG)}</span>` + " Loaded: <em>" + files[i].name + "</em></li>");
      var reader = new FileReader();
      reader.onload = function(event) {
        // NOTE: event.target point to FileReader
        var contents = event.target.result;
        var lines = contents.split('\n');
        css.push(contents);
      };

      reader.readAsText(f);
    }
    setTimeout(function() {
      helper.addCSSToAutocomplete(css);
    }, 10);
  };

  HelperContainer.prototype.addCSSToAutocomplete = function(css) {
    let helper = this;
    for (let i = 0; i < css.length; i++) {
      var parser = new cssjs();
      var parsed = parser.parseCSS(css[i].replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1'));
      // parser.getCSSForEditor(parsed)
      for (let j = 0; j < parsed.length; j++) {
        if (parsed[j].selector == ":root" || parsed[j].selector.search("data-theme") != -1) {
          if (parsed[j].rules) {
            for (let l = 0; l < parsed[j].rules.length; l++) {
              helper.autoCompleteData.push({
                label: parsed[j].rules[l].directive,
                category: "CSS Variable"
              });
              helper.autoCompleteData.push({
                label: parsed[j].rules[l].value,
                category: "Value"
              });
            }
          }
        } else {
          helper.autoCompleteData.push({
            label: parsed[j].selector,
            category: "Selector"
          });
        }
        if (parsed[j].rules) {
          for (let k = 0; k < parsed[j].rules.length; k++) {
            helper.autoCompleteData.push({
              label: parsed[j].rules[k].value,
              category: "Value"
            });
            helper.autoCompleteData.push({
              label: parsed[j].rules[k].directive,
              category: "Style"
            });
          }
        }
      }
    }
    setTimeout(function() {
      $("input[name='selectors']").autocomplete({
        source: helper.autoCompleteData.filter(function(info) {
          if (info.category == "Selector") return true;
          return false;
        }),
        autoFocus: true
      });
      $("input[name='attribute']").autocomplete({
        source: helper.autoCompleteData.filter(function(info) {
          if (info.category == "Style") return true;
          return false;
        }),
        autoFocus: true
      });
      $("input[name='style']").autocomplete({
        source: helper.autoCompleteData.filter(function(info) {
          if (info.category == "Value") return true;
          return false;
        }),
        autoFocus: true
      });
      $("input[name='variable name']").autocomplete({
        source: helper.autoCompleteData.filter(function(info) {
          if (info.category == "CSS Variable") return true;
          return false;
        }),
        autoFocus: true
      });
    }, 100);
  };

  HelperContainer.prototype.zoomControlSetup = function() {
    let helper = this;
    // Zoom Out
    $("#helper__zoom__mode > .fa-search-minus").click(function() {
      helper.scale -= 0.1;
      $("#helper__container").css({
        'transform': `scale(${helper.scale},${helper.scale})`
      });
    });

    // Zoom In
    $("#helper__zoom__mode > .fa-search-plus").click(function() {
      helper.scale += 0.1;
      $("#helper__container").css({
        'transform': `scale(${helper.scale},${helper.scale})`
      });
    });
  };

  HelperContainer.prototype.loadLibraries = function() {
    urls = [
      'https://ajax.googleapis.com/ajax/libs/webfont/1.5.0/webfont.js',
      './css.js'
    ];
    urls.forEach((url, i) => {
      loadExternalFiles(url);
    });

  };

  HelperContainer.prototype.setupUI = function() {
    let helper = this;
    // ACCORDION UIs
    $("#blank__helper__container").accordion({
      animate: 500,
      collapsible: true,
      heightStyle: "content",
      icons: false
    });

    $(".helper__element__styles").accordion({
      animate: 500,
      collapsible: true,
      heightStyle: "content",
      icons: false,
      active: true
    });

    $(":input").click(function() {
      $(this).focus();
    });
    $("#helper__toolbar").resizable({
      alsoResize: "#helper__container",
      animate: true,
      animateEasing: "easeOutBounce",
      distance: 30,
      maxHeight: 16,
      minWidth: 150
    });

    $("#blank__helper").hover(function() {
      $("#blank__helper__container").accordion("option", "disabled", true);
    }, function() {
      $("#blank__helper__container").accordion("option", "disabled", false);
    });


    // Make helper header content collapsible
    $(".helper__header").mouseenter(function() {

      $(".helper__header").click(function() {
        if ($(this).parent().children(".ui-accordion-content").hasClass("ui-accordion-content-active")) {
          $(this).parent().children(".ui-accordion-content").removeClass('ui-accordion-content-active').attr({
            'aria-expanded': 'false',
            'aria-hidden': 'true'
          }).hide();
        } else {
          $(this).parent().children('.ui-accordion-content').addClass('ui-accordion-content-active').attr({
            'aria-expanded': 'true',
            'aria-hidden': 'false'
          }).show();
        }
      });
    });



    // DRAGGABLE UIs
    $("#helper__container").draggable({
      cursor: "move",
      // cursorAt: {top: 0, left: 0},
      scroll: true,
      scrollSensitivity: 100,
      snap: ".helper__element",
      snapMode: "outer"
    });

    $("#blank__helper").draggable({
      connectToSortable: "#helper__sortable",
      helper: "clone",
      revert: "invalid",
      appendTo: "#helper__sortable",
      opacity: 0.35,
      scrollSensitivity: 100,
      distance: 100,
      cancel: ".helper__element__styles",
      stop: function(event, ui) {
        $(ui.helper).children(".helper__element").children(".helper__form__container").hide();
        $(ui.helper).css({
          height: "auto",
          width: "auto"
        });
        $(ui.helper).toggleClass("ui-sortable-handle");
        $("#blank__helper__container").children("#blank__helper").children(".helper__element").children(".helper__element__styles").children(".helper__styles__list").html('');
        $(".helper__form__container").hide();
        $("#blank__helper__container > li> section > section").show();
        $("#helper__sortable:not(.ui-sortable-handle)").toggleClass("ui-sortable-handle");
      }
    });

    $("#helper__font__import__container").draggable().resizable({
      animate: true,
      animateEasing: "easeOutBounce",
      distance: 30,
      minHeight: 180,
      maxHeight: $("#helper__imported__fonts").css('height').replace("px", '') + 180,
      minWidth: 150,
      ghost: true
    });




    // SORTABLE UIs
    $("#helper__sortable").sortable({
      revert: true,
      distance: 10,
      forceHelperSize: true,
      opacity: 0.5,
      cursor: "move"
    });




    // Specturm Color Picker UIs
    $(".helper__input__attr").change(function() {
      if ($(this).val().search("color") != -1 || $(this).val().search("Color") != -1) {
        lastColorStyleFocus = this;
        $("#helper__toolbar__spectrum__container").children(".sp-original-input-container").animate({
          opacity: 1
        });
        $("#color-picker").toggle().spectrum("show");
      }
    });

    $('#color-picker').spectrum({
      type: "component",
      togglePaletteOnly: "true",
      hideAfterPaletteSelect: "true",
      containerClassName: "helper__toolbar__spectrum__container",
      showInput: true,
      showInitial: true,
      allowEmpty: true,
      showAlpha: true,
      clickoutFiresChange: true,
      change: function(color) {
        if (lastColorStyleFocus != null) {
          $(lastColorStyleFocus).parent().children(".helper__input__style").val(color.toHexString()); // #ff0000;
        }

      }
    });

    $(".fa-palette").click(function() {
      if ($(this).parent().children(".sp-original-input-container").css('opacity') != 1) {
        $(this).parent().children(".sp-original-input-container").animate({
          opacity: 1
        });
      } else {
        $(this).parent().children(".sp-original-input-container").animate({
          opacity: 0
        });
      }
      $("#color-picker, .sp-original-input-container").toggle();
    });




    // TOOLBAR UI
    $(".fa-tools").click(function() {
      $("#helper__settings__container").css({
        'display': 'grid',
        'width': $("#helper__container").css('width')
      });
    });

    $("#helper__lock__mode").click(function() {
      if ($("#helper__lock__mode > .fa-lock").css('display') == "none") {
        // Set container to lock positioning
        $("#helper__container").draggable('disable');
        $("#helper__container").draggable('option', 'scroll', 'false');
        $("#helper__lock__mode > .fa-lock").css({
          'display': 'block'
        }).animate({
          'opacity': '1'
        });
        $("#helper__lock__mode > .fa-lock-open").animate({
          'opacity': '0'
        }).css({
          'display': 'none'
        });

      } else {
        // Enable draggable / resizeable
        $("#helper__container").draggable('enable');
        $("#helper__container").draggable('option', 'scroll', 'true');
        $("#helper__lock__mode > .fa-lock-open").css({
          'display': 'block'
        });
        $("#helper__lock__mode > .fa-lock").animate({
          'opacity': '0'
        });
        $("#helper__lock__mode > .fa-lock").css({
          'display': 'none'
        });
        $("#helper__lock__mode > .fa-lock-open").animate({
          'opacity': '1'
        });
      }
    });

    $("#helper__visibility__mode").click(function() {
      if ($("#helper__visibility__mode > .fa-eye-slash").css('display') == "none") {
        // Minimize widget

        // Create a dummy input to copy the string array inside it
        let helper__dummy = document.createElement("section");
        document.body.appendChild(helper__dummy);
        helper__dummy.setAttribute("id", "helper__minimized");
        $("#helper__minimized").html(`
          <i class="fas fa-eye-slash" id="minimized-icon"></i>
          `).draggable().position({
          my: "center",
          at: "center",
          of: $("#helper__toolbar")
        });
        $("#helper__minimized").css({
          'display': 'block'
        }).animate({
          'opacity': '1'
        }, 1000);
        $("#helper__container").animate({
          'opacity': '0'
        }, 1000).css({
          'display': 'hidden'
        });


        $("#helper__minimized > #minimized-icon").click(function() {

          $("#helper__container").position({
            my: "top",
            at: "top",
            of: $("#helper__minimized")
          }).animate({
            'opacity': '1'
          }, 1000);
          $("#helper__container").css({
            'display': 'block'
          });
          document.body.removeChild(helper__dummy);
        });


      }
    });

    $("#helper__export__mode").click(function() {
      if ($("#helper__export__mode > .fa-clipboard-check").css('display') == 'none') {
        helper.copyToClipboard();
        $("#helper__export__mode > .fa-clipboard-check").css({
          'display': 'block',
          'color': 'rgba(24, 210, 48, 0.7)'
        });
        $("#helper__vexport__mode > .fa-file-code").animate({
          'opacity': '0'
        });
        $("#helper__export__mode > .fa-file-code").css({
          'display': 'none'
        });
        $("#helper__export__mode > .fa-clipboard-check").animate({
          'opacity': '1'
        });
        setTimeout(function() {
          $("#helper__export__mode > .fa-clipboard-check").animate({
            'opacity': '0'
          }, 1000);
          $("#helper__export__mode > .fa-clipboard-check").css({
            'display': 'none',
            'color': 'rgba(255,255,255,.7)'
          });
          $("#helper__export__mode > .fa-file-code").css({
            'display': 'block'
          });
          $("#helper__export__mode > .fa-file-code").animate({
            'opacity': '1'
          });
        }, 2000);
      }
    });


    $("#helper__font__import__mode > .fa-paragraph").click(function() {
      if ($('#helper__font__import__container').css('display') == 'none') {
        $('#helper__font__import__container').css({
          'display': 'flex',
          'width': $("#helper__container").css('width'),
          'height': "auto",
          'opacity': 1
        });
        $("#helper__font__import__container").position({
          my: "center top",
          at: "center top+50",
          of: $("#helper__container")
        });
      } else {
        $('#helper__font__import__container').stop().animate({
          'opacity': 0
        });
        $('#helper__font__import__container').css({
          'display': 'none'
        });
      }
    });

    $("#helper__import__font__btn").click(function() {
      // Clear input
      let fontBtn = this;
      let fontsToImport = ($(this).parent().children(":input").val() + "").split(";");
      $(this).parent().children(":input").val('');
      let failedFonts = [];
      for (let i = 0; i < fontsToImport.length; i++) {
        if (fontsToImport[i].length < 2) continue;
        let fontLoader = '<span class="helper__font__import__icon">Starting</span>';
        let fontObject = $(`<li data-font-name='${fontsToImport[i].trim()}' class='helper__imported__font'>${fontsToImport[i].trim()}</li>`);
        $("#helper__imported__fonts").append(fontObject);
        WebFont.load({
          google: {
            families: [fontsToImport[i].trim()]
          },
          fontloading: function(familyName, fvd) {
            $(fontObject).html(familyName + `<span class='helper__font__import__icon'>${(loadingSVG)}</span>`);
          },
          fontactive: function(familyName, fvd) {
            $(fontObject).html(familyName + `<span class='helper__font__import__icon'>${(loadingCompleteSVG)}</span>`);
            $(fontObject).css({
              'fontFamily': fontsToImport[i].trim()
            });
          },
          fontinactive: function(familyName, fvd) {
            $(fontObject).html(familyName + `<span class='helper__font__import__icon'>${(errorSVG)}</span>`);
            failedFonts.push(fontsToImport[i]);

            console.log(failedFonts.toString().replace(",", ";"));
          },
          timeout: 5000 // Set the timeout to two seconds
        });


      }

      // Fill input with failed fonts
      setTimeout(function() {
        if (failedFonts.length > 0) {
          $("#helper__fonts__input").val(failedFonts.toString().replace(",", ";") + '').focus();
        }
      }, 5200);

    });

    $("#helper__font__import__container > .fa-times-circle").click(function() {
      $("#helper__font__import__container").animate({
        'opacity': 0
      }).css({
        'display': 'none'
      });
    });

    // SETTINGS UI
    $(".fa-times-circle").click(function() {
      $("#helper__settings__container").css({
        'display': 'none'
      });
    });

    // For file import listener
    $("#helper__css__import__input").on("change", function(e) {
      helper.getPageStyles(e.target.files);
      var $input = $(this),
        $label = $input.next('label'),
        labelVal = $label.html();
      var fileName = '';
      if (this.files && this.files.length > 1) {
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', +'\t' + this.files.length);
      } else if (e.target.value)
        fileName = e.target.value.split('\\').pop();

      if (fileName)
        $label.find('span').html(fileName);
      else
        $label.html(labelVal);

    });

    // For checkbox radios in settings
    $("fieldset").controlgroup();
    $("input[type='radio']").checkboxradio({
      icon: false
    });

    // For tooltips
    $(".helper__toolbar__icon").tooltip({
      track: true,
      show: {
        effect: "slideDown",
        delay: 450
      },
      hide: {
        // effect: "explode",
        delay: 250
      },
      classes: {
        "ui-tooltip": "helper__toolbar__tooltip"
      }
    });

    $("#helper__settings__import__css__btn").on('click', function() {
      $(".helper__settings__btn").removeClass("helper__current__setting");
      $(this).addClass("helper__current__setting");
      $("#helper__color__settings__container, #helper__user__settings__container").hide();
      $("#helper__css__import__container").show();
    });
    $("#helper__settings__color__btn").on('click', function() {
      $(".helper__settings__btn").removeClass("helper__current__setting");
      $(this).addClass("helper__current__setting");
      $("#helper__css__import__container, #helper__user__settings__container").hide();
      $("#helper__color__settings__container").show();
    });
    $("#helper__settings__user__btn").on('click', function() {
      $(".helper__settings__btn").removeClass("helper__current__setting");
      $(this).addClass("helper__current__setting");
      $("#helper__css__import__container, #helper__color__settings__container").hide();
      $("#helper__user__settings__container").show();
    });







    // BLANK HELPER UI

    // Change Form
    $("#checkbox").on("change", function() {
      if ($(this).parent().parent().children(".selector").css('display') == 'none') {
        $(this).parent().parent().children(".selector").css('display', 'block');
        $(this).parent().parent().children(".variable").css('display', 'none');
      } else {
        $(this).parent().parent().children(".selector").css('display', 'none');
        $(this).parent().parent().children(".variable").css('display', 'block');
      }
    });

    $('.add__helper__attr__btn').click(function() {
      let listToAppendTo = $(this).parent().parent().parent().children(".helper__element__styles").children(".helper__styles__list__container").children(".helper__styles__list");
      let type = $(this).parent().parent().children(".helper__form").children(".checkbox").prop("checked");
      let inputs = $(this).parent().parent().children(".helper__form").find(":input");
      if (!type) {
        listToAppendTo.append(`
            <li class="helper__element__styles helper__styles__from__template">
              <h3 class="helper__header">${inputs[1].value}, ${inputs[2].value}, ${inputs[3].value}
                <i class="fas fa-minus-circle style-minus-icon"></i>
              </h3>
            </li>`);
      } else {
        listToAppendTo.append(`
            <li class="helper__element__styles helper__styles__from__template">
              <h3 class="helper__header">${inputs[1].value}, ${inputs[2].value}
                <i class="fas fa-minus-circle style-minus-icon"></i>
              </h3>
            </li>`);
      }

      // Add functions for buttons arrows here
      let rightArrow = $(listToAppendTo).children(".helper__element__styles").children(".helper__header").children(".fa-arrow-circle-right");
      let leftArrow = $(listToAppendTo).children(".helper__element__styles").children(".helper__header").children(".fa-arrow-circle-left");
      let minusCircle = $(listToAppendTo).children(".helper__element__styles").children(".helper__header").children(".fa-minus-circle");
      let header = $(listToAppendTo).children(".helper__element__styles").children(".helper__header");
      helper.newStyles.push(new HelperStyle(inputs, rightArrow, leftArrow, minusCircle, header));
      $(listToAppendTo).parent(".ui-accordion-content").addClass('ui-accordion-content-active').attr({
        'aria-expanded': 'true',
        'aria-hidden': 'false'
      }).show();
      $(listToAppendTo).parent(".ui-accordion-content").parent().children(".ui-accordion-header-collapsed").removeClass("ui-accordion-header-collapsed").addClass("ui-accordion-header-active ui-state-active");
    });

    // Remove blank helper styles
    $(".helper__header").mouseenter(function() {
      $("#blank__helper").children().children(".helper__element__styles").children(".helper__styles__list__container").children(".helper__styles__list").children(".helper__element__styles").children(".helper__header").children(".fa-minus-circle").click(function() {
        $(this).parent().parent().remove();
      });
    });

    // Change form input for selector type
    $('input[type="checkbox"]').click(function() {
      if ($(this).prop("checked") == true) {
        $(this).parent().children(".selector").hide();
        $(this).parent().children(".variable").show();
      } else if ($(this).prop("checked") == false) {
        $(this).parent().children(".selector").show();
        $(this).parent().children(".variable").hide();
      }
    });



    // Create a new helper
    $(".add__helper__btn").click(function() {
      let styles = $(this).parent().parent().parent().children(".helper__element__styles").children(".helper__styles__list__container").children(".helper__styles__list").children();
      $(this).parent().parent().parent().children(".helper__element__styles").children(".ui-accordion-content").addClass('ui-accordion-content-active').attr({
        'aria-expanded': 'true',
        'aria-hidden': 'false'
      }).show();
      $(this).parent().parent().parent().children(".helper__element__styles").children(".ui-accordion-content").parent().children(".ui-accordion-header-collapsed").removeClass("ui-accordion-header-collapsed").addClass("ui-accordion-header-active ui-state-active");
      let helperName = $(this).parent().parent().parent().children(".helper__element__styles").find(":input").val();
      $("#helper__sortable").append('<li class="helper__containment ui-sortable-handle>"' + $("#blank__helper").html() + "</li>");
      let helperHeader = $("#helper__sortable").last(".helper__containment").find("label").parent();
      $("#helper__sortable").last(".helper__containment").find("label").remove();
      $("#helper__sortable").last(".helper__containment").find(":input").remove();
      $(helperHeader).html(`
        ${helperName}
        <i class="fas fa-minus-circle style-minus-icon"></i>
        <i class="fas fa-arrow-circle-right"></i>
        <i class="fas fa-arrow-circle-left"></i>
        `);
      let minusCircle = $(helperHeader).children(".style-minus-icon");
      let rightArrow = $(helperHeader).children(".fa-arrow-circle-right");
      let leftArrow = $(helperHeader).children(".fa-arrow-circle-left");

      // Clear template form
      $("#blank__helper__container").children("#blank__helper").children(".helper__element").children(".helper__element__styles").children(".helper__styles__list__container").children(".helper__styles__list").html('');
      // Hide any forms
      $(".helper__form__container").hide();
      // Show template form
      $("#blank__helper__container > li> section > section").show();
      // Make sure that the new helper is sortable
      $("#helper__sortable:not(.ui-sortable-handle)").toggleClass("ui-sortable-handle");

      $(".helper__sortable").sortable("refresh");
      $(".helper__containment:not(.ui-accordion)").toggleClass(" ui-accordion ui-widget ui-helper-reset");

      //Create Helper Style Element
      let newHelper = new Helper(helper.newStyles, leftArrow, rightArrow, minusCircle, helperHeader);
      helper.helpers.push(newHelper);
      newHelper.setup();
      helper.newStyles = [];
    });


  };

  let helperContainer = new HelperContainer({});
  helperContainer.setup();
  let lastColorStyleFocus = null;

  let loadingCompleteSVG = (`
<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>`);

  let loadingSVG = (`
    <svg class="helper__loading__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <circle cx="50" cy="36.0746" r="13" fill="#b3c430">
      <animate attributeName="cy" dur="0.8403361344537814s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9" keyTimes="0;0.5;1" values="23;77;23"></animate>
    </circle>`);

  let errorSVG = (`<svg class="helper__error__icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" style="margin: auto; background: none; display: block; shape-rendering: auto;" ><g class="ldl-scale" style="transform-origin: 50% 50%; transform: rotate(0deg) scale(1, 1);" preserveAspectRatio="xMidYMid"><g class="ldl-ani" style="transform: scale(0.91); transform-origin: 50px 50px; animation: 1s linear 0s infinite normal forwards running breath-984dfb0c-05aa-46b3-9524-00617a894cbf;"><g class="ldl-layer"><g class="ldl-ani"><path fill="#c33837" d="M42.7 20.6L11.5 69.7c-1.8 2.7-2 6.1-.5 9 1.5 2.9 4.5 4.6 7.7 4.6H50V16.7c-2.9 0-5.6 1.4-7.3 3.9z" style="fill: rgba(195, 56, 55, 0.7);"></path></g></g><g class="ldl-layer"><g class="ldl-ani"><path fill="#e15c64" d="M89 78.7c1.5-2.9 1.4-6.3-.4-9L57.2 20.6c-1.6-2.4-4.3-3.9-7.2-3.9v66.6h31.3c3.2 0 6.1-1.8 7.7-4.6z" style="fill: rgba(225, 92, 100, 0.7);"></path></g></g><g class="ldl-layer"><g class="ldl-ani"><path d="M64.5 50.3l-5.8-5.8-8.7 8.7-8.7-8.7-5.8 5.8 8.7 8.7-8.7 8.7 5.8 5.8 8.7-8.7 8.7 8.7 5.8-5.8-8.7-8.7z" fill="#f4e6c8" style="fill: rgba(244, 230, 200, 0.7);"></path></g></g><metadata xmlns:d="https://loading.io/stock/"><d:name>error</d:name><d:tags>fail,disable,exception,errant,bad,break,stop,error,web application</d:tags><d:license>by</d:license><d:slug>4grrdv</d:slug></metadata></g></g></svg>`);


  $.fn.extend({
    getSelectorPath: function() {
      let path,
        node = this,
        realNode,
        name,
        parent,
        index,
        sameTagSiblings,
        allSiblings,
        className,
        classSelector,
        nestingLevel = true;

      while (node.length && nestingLevel) {
        realNode = node[0];
        name = realNode.localName;
        if (!name) break;
        name = name.toLowerCase();
        parent = node.parent();
        sameTagSiblings = parent.children(name);
        if (realNode.id) {
          name += "#" + node[0].id;
          nestingLevel = false;
        } else if (realNode.className.length) {
          className = realNode.className.split(' ');
          classSelector = '';
          className.forEach(function(item) {
            classSelector += '.' + item;
          });
          name += classSelector;
        } else if (sameTagSiblings.length > 1) {
          allSiblings = parent.children();
          index = allSiblings.index(realNode) + 1;
          if (index > 1) {
            name += ':nth-child(' + index + ')';
          }
        }
        path = name + (path ? '>' + path : '');
        node = parent;
      }
      return path;
    }
  });
});
