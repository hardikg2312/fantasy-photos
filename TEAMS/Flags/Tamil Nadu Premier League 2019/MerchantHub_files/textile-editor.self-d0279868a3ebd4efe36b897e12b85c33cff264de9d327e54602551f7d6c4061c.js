(function() {
  var TextileEditor, TextileEditorButton, TextileEditorButtonSeparator;

  TextileEditorButton = (function() {
    function TextileEditorButton(id, display, tagStart, tagEnd, access, title, sve, open) {
      this.id = id;
      this.display = display;
      this.tagStart = tagStart;
      this.tagEnd = tagEnd;
      this.access = access;
      this.title = title;
      this.sve = sve;
      this.open = open;
      this.standard = true;
    }

    return TextileEditorButton;

  })();

  window.TextileEditorButton = TextileEditorButton;

  TextileEditorButtonSeparator = (function() {
    function TextileEditorButtonSeparator(sve) {
      this.separator = true;
      this.sve = sve;
    }

    return TextileEditorButtonSeparator;

  })();

  window.TextileEditorButtonSeparator = TextileEditorButtonSeparator;

  TextileEditor = (function() {
    TextileEditor.setButtons = function(buttons) {
      return TextileEditor.buttons = buttons;
    };

    TextileEditor.addButton = function(button) {
      return this.getButtons().push(button);
    };

    TextileEditor.getButtons = function() {
      return TextileEditor.buttons || new Array();
    };

    function TextileEditor(canvas, view) {
      var buttons, edButtons, i, standardButtons, te, thisButton, toolbar;
      toolbar = document.createElement("div");
      toolbar.id = "textile-toolbar-" + canvas;
      toolbar.className = "textile-toolbar";
      this.canvas = document.getElementById(canvas);
      this.canvas.parentNode.insertBefore(toolbar, this.canvas);
      this.openTags = new Array();
      edButtons = TextileEditor.getButtons();
      standardButtons = new Array();
      i = 0;
      while (i < edButtons.length) {
        thisButton = this.prepareButton(edButtons[i]);
        if (view === "simple") {
          if (edButtons[i].sve === "s") {
            toolbar.appendChild(thisButton);
            standardButtons.push(thisButton);
          }
        } else {
          if (typeof thisButton === "string") {
            toolbar.innerHTML += thisButton;
          } else {
            toolbar.appendChild(thisButton);
            standardButtons.push(thisButton);
          }
        }
        i++;
      }
      te = this;
      buttons = toolbar.getElementsByTagName("button");
      i = 0;
      while (i < buttons.length) {
        if (!buttons[i].onclick) {
          buttons[i].onclick = function() {
            te.insertTag(this);
            return false;
          };
        }
        buttons[i].tagStart = buttons[i].getAttribute("tagStart");
        buttons[i].tagEnd = buttons[i].getAttribute("tagEnd");
        buttons[i].open = buttons[i].getAttribute("open");
        buttons[i].textile_editor = te;
        buttons[i].canvas = te.canvas;
        i++;
      }
    }

    TextileEditor.prototype.prepareButton = function(button) {
      var img, theButton;
      if (button.separator) {
        theButton = document.createElement("span");
        theButton.className = "ed_sep";
        return theButton;
      }
      if (button.standard) {
        theButton = document.createElement("button");
        theButton.id = button.id;
        theButton.setAttribute("class", "standard");
        theButton.setAttribute("tagStart", button.tagStart);
        theButton.setAttribute("tagEnd", button.tagEnd);
        theButton.setAttribute("open", button.open);
        img = document.createElement("img");
        img.src = button.display;
        theButton.appendChild(img);
      } else {
        return button;
      }
      theButton.accessKey = button.access;
      theButton.title = button.title;
      return theButton;
    };

    TextileEditor.prototype.addTag = function(button) {
      if (button.tagEnd !== "") {
        this.openTags[this.openTags.length] = button;
        button.className = "selected";
      }
      return button;
    };

    TextileEditor.prototype.removeTag = function(button) {
      var i;
      i = 0;
      while (i < this.openTags.length) {
        if (this.openTags[i] === button) {
          this.openTags.splice(button, 1);
          button.className = "unselected";
        }
        i++;
      }
      return void 0;
    };

    TextileEditor.prototype.checkOpenTags = function(button) {
      var i, tag;
      tag = 0;
      i = 0;
      while (i < this.openTags.length) {
        if (this.openTags[i] === button) {
          tag++;
        }
        i++;
      }
      return tag > 0;
    };

    TextileEditor.prototype.insertTag = function(button, tagStart, tagEnd) {
      var FF, beginningText, buttonEnd, buttonStart, captureIndentStart, captureListStart, cursorPos, drawSwitch, endPos, finalText, followupText, i, indentLength, insertModifier, insertTag, listInsert, listItems, listItemsAddition, listPartMatches, listReplace, listType, listTypeMatch, matches, mplier, myField, newlineEnd, newlineEndPos, newlineFollowup, newlineReplaceClean, newlineReplaceRegexClean, newlineReplaceRegexDirty, newlineStart, newlineStartPos, newlineStartpos, newm, periodAddition, periodAdditionClean, posDiffNeg, posDiffPos, re_block_modifier, re_end, re_h, re_list_items, re_middle, re_old, re_p, re_replace, re_start, re_tag, re_word_bullet_m_f, re_word_bullet_m_s, scrollTop, sel, selectedText, startPos, tagCurrentLength, tagPartBlock, tagPartMatches, tagPartModifier, tagPartModifierOrig, tagPreviousLength, textSelected;
      myField = button.canvas;
      myField.focus();
      if (tagStart) {
        button.tagStart = tagStart;
        button.tagEnd = (tagEnd ? tagEnd : "\n");
      }
      textSelected = false;
      finalText = "";
      FF = false;
      if (document.selection) {
        sel = document.selection.createRange();
        beginningText = "";
        followupText = "";
        selectedText = sel.text;
        if (sel.text.length > 0) {
          textSelected = true;
        }
        newlineReplaceRegexClean = /\r\n\s\n/g;
        newlineReplaceRegexDirty = "\\r\\n\\s\\n";
        newlineReplaceClean = "\r\n\n";
      } else if (myField.selectionStart || myField.selectionStart === 0 || myField.selectionStart === '0') {
        startPos = myField.selectionStart;
        endPos = myField.selectionEnd;
        cursorPos = endPos;
        scrollTop = myField.scrollTop;
        FF = true;
        beginningText = myField.value.substring(0, startPos);
        followupText = myField.value.substring(endPos, myField.value.length);
        if (startPos !== endPos) {
          textSelected = true;
          selectedText = myField.value.substring(startPos, endPos);
        }
        newlineReplaceRegexClean = /\n\n/g;
        newlineReplaceRegexDirty = "\\n\\n";
        newlineReplaceClean = "\n\n";
      }
      if (textSelected) {
        newlineStart = "";
        newlineStartPos = 0;
        newlineEnd = "";
        newlineEndPos = 0;
        newlineFollowup = "";
        posDiffPos = 0;
        posDiffNeg = 0;
        mplier = 1;
        if (selectedText.match(/^\n/)) {
          selectedText = selectedText.replace(/^\n/, "");
          newlineStart = "\n";
          newlineStartpos = 1;
        }
        if (selectedText.match(/\n$/g)) {
          selectedText = selectedText.replace(/\n$/g, "");
          newlineEnd = "\n";
          newlineEndPos = 1;
        }
        if (followupText.match(/^\n/)) {
          newlineFollowup = "";
        } else {
          newlineFollowup = "\n\n";
        }
        if ((button.tagStart === " * ") || (button.tagStart === " # ")) {
          listItems = 0;
          re_start = new RegExp("^ (\\*|\\#) ", "g");
          if (button.tagStart === " # ") {
            re_tag = new RegExp(" \\# ", "g");
          } else {
            re_tag = new RegExp(" \\* ", "g");
          }
          re_replace = new RegExp(" (\\*|\\#) ", "g");
          re_word_bullet_m_s = new RegExp("• ", "g");
          re_word_bullet_m_f = new RegExp("∑ ", "g");
          selectedText = selectedText.replace(re_word_bullet_m_s, "").replace(re_word_bullet_m_f, "");
          if (selectedText.match(re_start)) {
            if (selectedText.match(re_tag)) {
              finalText = beginningText + newlineStart + selectedText.replace(re_replace, "") + newlineEnd + followupText;
              if (matches = selectedText.match(RegExp(" (\\*|\\#) ", "g"))) {
                listItems = matches.length;
              }
              posDiffNeg = listItems * 3;
            } else {
              finalText = beginningText + newlineStart + selectedText.replace(re_replace, button.tagStart) + newlineEnd + followupText;
            }
          } else {
            finalText = beginningText + newlineStart + button.tagStart + selectedText.replace(newlineReplaceRegexClean, newlineReplaceClean + button.tagStart).replace(/\n(\S)/g, "\n" + button.tagStart + "$1") + newlineEnd + followupText;
            if (matches = selectedText.match(/\n(\S)/g)) {
              listItems = matches.length;
            }
            posDiffPos = 3 + listItems * 3;
          }
        } else if (button.tagStart.match(/^(h1|h2|h3|h4|h5|h6|bq|p|\>|\<\>|\<|\=|\(|\))/g)) {
          insertTag = "";
          insertModifier = "";
          tagPartBlock = "";
          tagPartModifier = "";
          tagPartModifierOrig = "";
          drawSwitch = "";
          captureIndentStart = false;
          captureListStart = false;
          periodAddition = "\\. ";
          periodAdditionClean = ". ";
          listItemsAddition = 0;
          re_list_items = new RegExp("(\\*+|\\#+)", "g");
          re_block_modifier = new RegExp("^(h1|h2|h3|h4|h5|h6|bq|p| [\\*]{1,} | [\\#]{1,} |)(\\>|\\<\\>|\\<|\\=|[\\(]{1,}|[\\)]{1,6}|)", "g");
          if (tagPartMatches = re_block_modifier.exec(selectedText)) {
            tagPartBlock = tagPartMatches[1];
            tagPartModifier = tagPartMatches[2];
            tagPartModifierOrig = tagPartMatches[2];
            tagPartModifierOrig = tagPartModifierOrig.replace(/\(/g, "\\(");
          }
          if (tagPartBlock === button.tagStart) {
            insertTag = tagPartBlock + tagPartModifierOrig;
            drawSwitch = 0;
          } else if ((tagPartModifier === button.tagStart) || (newm = tagPartModifier.match(/[\(]{2,}/g))) {
            if ((button.tagStart === "(") || (button.tagStart === ")")) {
              indentLength = tagPartModifier.length;
              if (button.tagStart === "(") {
                indentLength = indentLength + 1;
              } else {
                indentLength = indentLength - 1;
              }
              i = 0;
              while (i < indentLength) {
                insertModifier = insertModifier + "(";
                i++;
              }
              insertTag = tagPartBlock + insertModifier;
            } else {
              if (button.tagStart === tagPartModifier) {
                insertTag = tagPartBlock;
              } else {
                if (button.tagStart.match(/(\>|\<\>|\<|\=)/g)) {
                  insertTag = tagPartBlock + button.tagStart;
                } else {
                  insertTag = button.tagStart + tagPartModifier;
                }
              }
            }
            drawSwitch = 1;
          } else if (listPartMatches = re_list_items.exec(tagPartBlock)) {
            listTypeMatch = listPartMatches[1];
            indentLength = tagPartBlock.length - 2;
            listInsert = "";
            if (button.tagStart === "(") {
              indentLength = indentLength + 1;
            } else {
              indentLength = indentLength - 1;
            }
            if (listTypeMatch.match(/[\*]{1,}/g)) {
              listType = "*";
              listReplace = "\\*";
            } else {
              listType = "#";
              listReplace = "\\#";
            }
            i = 0;
            while (i < indentLength) {
              listInsert = listInsert + listType;
              i++;
            }
            if (listInsert !== "") {
              insertTag = " " + listInsert + " ";
            } else {
              insertTag = "";
            }
            tagPartBlock = tagPartBlock.replace(/(\*|\#)/g, listReplace);
            drawSwitch = 1;
            captureListStart = true;
            periodAddition = "";
            periodAdditionClean = "";
            if (matches = selectedText.match(/\n\s/g)) {
              listItemsAddition = matches.length;
            }
          } else {
            if (button.tagStart.match(/(h1|h2|h3|h4|h5|h6|bq|p)/g)) {
              if (tagPartBlock === "") {
                drawSwitch = 2;
              } else {
                drawSwitch = 1;
              }
              insertTag = button.tagStart + tagPartModifier;
            } else {
              if ((tagPartModifier === "") && (tagPartBlock !== "")) {
                drawSwitch = 1;
              } else if (tagPartModifier === "") {
                drawSwitch = 2;
              } else {
                drawSwitch = 1;
              }
              if (tagPartBlock === "") {
                tagPartBlock = "p";
              }
              if (button.tagStart === ")") {
                tagPartModifier = "";
              } else {
                tagPartModifier = button.tagStart;
                captureIndentStart = true;
              }
              insertTag = tagPartBlock + tagPartModifier;
            }
          }
          mplier = 0;
          if (captureListStart || (tagPartModifier.match(/[\(\)]{1,}/g))) {
            re_start = new RegExp(insertTag.escape + periodAddition, "g");
          } else {
            re_start = new RegExp(insertTag + periodAddition, "g");
          }
          re_old = new RegExp(tagPartBlock + tagPartModifierOrig + periodAddition, "g");
          re_middle = new RegExp(newlineReplaceRegexDirty + insertTag.escape + periodAddition.escape, "g");
          re_tag = new RegExp(insertTag.escape + periodAddition.escape, "g");
          if ((drawSwitch === 0) || (drawSwitch === 1)) {
            if (drawSwitch === 0) {
              finalText = beginningText + newlineStart + selectedText.replace(re_start, "").replace(re_middle, newlineReplaceClean) + newlineEnd + followupText;
              if (matches = selectedText.match(newlineReplaceRegexClean)) {
                mplier = mplier + matches.length;
              }
              posDiffNeg = insertTag.length + 2 + (mplier * 4);
            } else {
              finalText = beginningText + newlineStart + selectedText.replace(re_old, insertTag + periodAdditionClean) + newlineEnd + followupText;
              if (matches = selectedText.match(newlineReplaceRegexClean)) {
                mplier = mplier + matches.length;
              }
              if (captureIndentStart) {
                tagPreviousLength = tagPartBlock.length;
                tagCurrentLength = insertTag.length;
              } else if (captureListStart) {
                if (button.tagStart === "(") {
                  tagPreviousLength = listTypeMatch.length + 2;
                  tagCurrentLength = insertTag.length + listItemsAddition;
                } else if (insertTag.match(/(\*|\#)/g)) {
                  tagPreviousLength = insertTag.length + listItemsAddition;
                  tagCurrentLength = listTypeMatch.length;
                } else {
                  tagPreviousLength = insertTag.length + listItemsAddition;
                  tagCurrentLength = listTypeMatch.length - (3 * listItemsAddition) - 1;
                }
              } else {
                tagPreviousLength = tagPartBlock.length + tagPartModifier.length;
                tagCurrentLength = insertTag.length;
              }
              if (tagCurrentLength > tagPreviousLength) {
                posDiffPos = (tagCurrentLength - tagPreviousLength) + (mplier * (tagCurrentLength - tagPreviousLength));
              } else {
                posDiffNeg = (tagPreviousLength - tagCurrentLength) + (mplier * (tagPreviousLength - tagCurrentLength));
              }
            }
          } else {
            finalText = beginningText + newlineStart + insertTag + ". " + selectedText.replace(newlineReplaceRegexClean, button.tagEnd + "\n" + insertTag + ". ") + newlineFollowup + newlineEnd + followupText;
            if (matches = selectedText.match(newlineReplaceRegexClean)) {
              mplier = mplier + matches.length;
            }
            posDiffPos = insertTag.length + 2 + (mplier * 4);
          }
        } else {
          mplier = 1;
          re_start = new RegExp("^\\" + button.tagStart, "g");
          re_end = new RegExp("\\" + button.tagEnd + "$", "g");
          re_middle = new RegExp("\\" + button.tagEnd + newlineReplaceRegexDirty + "\\" + button.tagStart, "g");
          if (selectedText.match(re_start) && selectedText.match(re_end)) {
            finalText = beginningText + newlineStart + selectedText.replace(re_start, "").replace(re_end, "").replace(re_middle, newlineReplaceClean) + newlineEnd + followupText;
            if (matches = selectedText.match(newlineReplaceRegexClean)) {
              mplier = mplier + matches.length;
            }
            posDiffNeg = button.tagStart.length * mplier + button.tagEnd.length * mplier;
          } else {
            finalText = beginningText + newlineStart + button.tagStart + selectedText.replace(newlineReplaceRegexClean, button.tagEnd + newlineReplaceClean + button.tagStart) + button.tagEnd + newlineEnd + followupText;
            if (matches = selectedText.match(newlineReplaceRegexClean)) {
              mplier = mplier + matches.length;
            }
            posDiffPos = (button.tagStart.length * mplier) + (button.tagEnd.length * mplier);
          }
        }
        cursorPos += button.tagStart.length + button.tagEnd.length;
      } else {
        buttonStart = "";
        buttonEnd = "";
        re_p = new RegExp("(\\<|\\>|\\=|\\<\\>|\\(|\\))", "g");
        re_h = new RegExp("^(h1|h2|h3|h4|h5|h6|p|bq)", "g");
        if (!this.checkOpenTags(button) || button.tagEnd === "") {
          if (button.tagStart.match(re_h)) {
            buttonStart = button.tagStart + ". ";
          } else {
            buttonStart = button.tagStart;
          }
          if (button.tagStart.match(re_p)) {
            finalText = beginningText + followupText;
            cursorPos = startPos;
          } else {
            finalText = beginningText + buttonStart + followupText;
            this.addTag(button);
            cursorPos = startPos + buttonStart.length;
          }
        } else {
          if (button.tagStart.match(re_p)) {
            buttonEnd = "\n\n";
          } else if (button.tagStart.match(re_h)) {
            buttonEnd = "\n\n";
          } else {
            buttonEnd = button.tagEnd;
          }
          finalText = beginningText + button.tagEnd + followupText;
          this.removeTag(button);
          cursorPos = startPos + button.tagEnd.length;
        }
      }
      if (FF === true) {
        myField.value = finalText;
        myField.scrollTop = scrollTop;
      } else {
        sel.text = finalText;
      }
      if (textSelected) {
        myField.selectionStart = startPos + newlineStartPos;
        return myField.selectionEnd = endPos + posDiffPos - posDiffNeg - newlineEndPos;
      } else {
        myField.selectionStart = cursorPos;
        return myField.selectionEnd = cursorPos;
      }
    };

    return TextileEditor;

  })();

  window.TextileEditor = TextileEditor;

}).call(this);
