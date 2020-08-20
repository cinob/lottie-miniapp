import { createSizedArray } from '../index';
import Matrix from '../../3rd_party/transformation-matrix';
import PropertyFactory from '../PropertyFactory';
import TextAnimatorDataProperty from './TextAnimatorDataProperty';
import bez from '../bez';
import { addHueToRGB, addSaturationToRGB, addBrightnessToRGB } from '../common';
import LetterProps from '../LetterProps';
import DynamicPropertyContainer from '../dynamicProperties';

export default class TextAnimatorProperty extends DynamicPropertyContainer {
  constructor(textData, renderType, elem) {
    super();
    this._isFirstFrame = true;
    this._hasMaskedPath = false;
    this._frameId = -1;
    this._textData = textData;
    this._renderType = renderType;
    this._elem = elem;
    this._animatorsData = createSizedArray(this._textData.a.length);
    this._pathData = {};
    this._moreOptions = {
      alignment: {}
    };
    this.renderedLetters = [];
    this.lettersChangedFlag = false;
    this.initDynamicPropertyContainer(elem);
  }

  addDynamicProperty() {
    console.log('see:', 'https://github.com/airbnb/lottie-web/blob/adb67aaed3058a331d93fe0b87df5129f9fcab57/player/js/utils/text/TextAnimatorProperty.js#L21:53');
  }

  searchProperties() {
    let i;
    let len = this._textData.a.length;
    let animatorProps;
    let getProp = PropertyFactory.getProp;
    for (i = 0; i < len; i += 1) {
      animatorProps = this._textData.a[i];
      this._animatorsData[i] = new TextAnimatorDataProperty(this._elem, animatorProps, this);
    }
    if (this._textData.p && 'm' in this._textData.p) {
      this._pathData = {
        f: getProp(this._elem, this._textData.p.f, 0, 0, this),
        l: getProp(this._elem, this._textData.p.l, 0, 0, this),
        r: this._textData.p.r,
        m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
      };
      this._hasMaskedPath = true;
    } else {
      this._hasMaskedPath = false;
    }
    this._moreOptions.alignment = getProp(this._elem, this._textData.m.a, 1, 0, this);
  }

  getMeasures(documentData, lettersChangedFlag) {
    this.lettersChangedFlag = lettersChangedFlag;
    if (!this._mdf && !this._isFirstFrame && !lettersChangedFlag && (!this._hasMaskedPath || !this._pathData.m._mdf)) {
      return;
    }
    this._isFirstFrame = false;
    let alignment = this._moreOptions.alignment.v;
    let animators = this._animatorsData;
    let textData = this._textData;
    let matrixHelper = this.mHelper;
    let renderType = this._renderType;
    let renderedLettersCount = this.renderedLetters.length;
    // let data = this.data;
    let xPos;
    let yPos;
    let i;
    let len;
    let letters = documentData.l;
    let pathInfo;
    let currentLength;
    let currentPoint;
    let segmentLength;
    let flag;
    let pointInd;
    let segmentInd;
    let prevPoint;
    let points;
    let segments;
    let partialLength;
    let totalLength;
    let perc;
    let tanAngle;
    let mask;
    if (this._hasMaskedPath) {
      mask = this._pathData.m;
      if (!this._pathData.n || this._pathData._mdf) {
        let paths = mask.v;
        if (this._pathData.r) {
          paths = paths.reverse();
        }
        // TODO: release bezier data cached from previous pathInfo: this._pathData.pi
        pathInfo = {
          tLength: 0,
          segments: []
        };
        len = paths._length - 1;
        let bezierData;
        totalLength = 0;
        for (i = 0; i < len; i += 1) {
          bezierData = bez.buildBezierData(paths.v[i],
            paths.v[i + 1],
            [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
            [paths.i[i + 1][0] - paths.v[i + 1][0], paths.i[i + 1][1] - paths.v[i + 1][1]]);
          pathInfo.tLength += bezierData.segmentLength;
          pathInfo.segments.push(bezierData);
          totalLength += bezierData.segmentLength;
        }
        i = len;
        if (mask.v.c) {
          bezierData = bez.buildBezierData(paths.v[i],
            paths.v[0],
            [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
            [paths.i[0][0] - paths.v[0][0], paths.i[0][1] - paths.v[0][1]]);
          pathInfo.tLength += bezierData.segmentLength;
          pathInfo.segments.push(bezierData);
          totalLength += bezierData.segmentLength;
        }
        this._pathData.pi = pathInfo;
      }
      pathInfo = this._pathData.pi;

      currentLength = this._pathData.f.v;
      segmentInd = 0;
      pointInd = 1;
      segmentLength = 0;
      flag = true;
      segments = pathInfo.segments;
      if (currentLength < 0 && mask.v.c) {
        if (pathInfo.tLength < Math.abs(currentLength)) {
          currentLength = -Math.abs(currentLength) % pathInfo.tLength;
        }
        segmentInd = segments.length - 1;
        points = segments[segmentInd].points;
        pointInd = points.length - 1;
        while (currentLength < 0) {
          currentLength += points[pointInd].partialLength;
          pointInd -= 1;
          if (pointInd < 0) {
            segmentInd -= 1;
            points = segments[segmentInd].points;
            pointInd = points.length - 1;
          }
        }
      }
      points = segments[segmentInd].points;
      prevPoint = points[pointInd - 1];
      currentPoint = points[pointInd];
      partialLength = currentPoint.partialLength;
    }


    len = letters.length;
    xPos = 0;
    yPos = 0;
    let yOff = documentData.finalSize * 1.2 * 0.714;
    let firstLine = true;
    let animatorProps;
    let animatorSelector;
    let j;
    let jLen;
    let letterValue;

    jLen = animators.length;
    // let lastLetter;

    let mult;
    let ind = -1;
    let offf;
    let xPathPos;
    let yPathPos;
    let initPathPos = currentLength;
    let initSegmentInd = segmentInd;
    let initPointInd = pointInd;
    let currentLine = -1;
    let elemOpacity;
    let sc;
    let sw;
    let fc;
    let k;
    // let lineLength = 0;
    let letterSw;
    let letterSc;
    let letterFc;
    let letterM = '';
    let letterP = this.defaultPropsArray;
    let letterO;

    //
    if (documentData.j === 2 || documentData.j === 1) {
      let animatorJustifyOffset = 0;
      let animatorFirstCharOffset = 0;
      let justifyOffsetMult = documentData.j === 2 ? -0.5 : -1;
      let lastIndex = 0;
      let isNewLine = true;

      for (i = 0; i < len; i += 1) {
        if (letters[i].n) {
          if (animatorJustifyOffset) {
            animatorJustifyOffset += animatorFirstCharOffset;
          }
          while (lastIndex < i) {
            letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset;
            lastIndex += 1;
          }
          animatorJustifyOffset = 0;
          isNewLine = true;
        } else {
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            if (animatorProps.t.propType) {
              if (isNewLine && documentData.j === 2) {
                animatorFirstCharOffset += animatorProps.t.v * justifyOffsetMult;
              }
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              if (mult.length) {
                animatorJustifyOffset += animatorProps.t.v * mult[0] * justifyOffsetMult;
              } else {
                animatorJustifyOffset += animatorProps.t.v * mult * justifyOffsetMult;
              }
            }
          }
          isNewLine = false;
        }
      }
      if (animatorJustifyOffset) {
        animatorJustifyOffset += animatorFirstCharOffset;
      }
      while (lastIndex < i) {
        letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset;
        lastIndex += 1;
      }
    }
    //

    for (i = 0; i < len; i += 1) {
      matrixHelper.reset();
      elemOpacity = 1;
      if (letters[i].n) {
        xPos = 0;
        yPos += documentData.yOffset;
        yPos += firstLine ? 1 : 0;
        currentLength = initPathPos;
        firstLine = false;
        // lineLength = 0;
        if (this._hasMaskedPath) {
          segmentInd = initSegmentInd;
          pointInd = initPointInd;
          points = segments[segmentInd].points;
          prevPoint = points[pointInd - 1];
          currentPoint = points[pointInd];
          partialLength = currentPoint.partialLength;
          segmentLength = 0;
        }
        letterO = letterSw = letterFc = letterM = '';
        letterP = this.defaultPropsArray;
      } else {
        if (this._hasMaskedPath) {
          if (currentLine !== letters[i].line) {
            // eslint-disable-next-line default-case
            switch (documentData.j) {
              case 1:
                currentLength += totalLength - documentData.lineWidths[letters[i].line];
                break;
              case 2:
                currentLength += (totalLength - documentData.lineWidths[letters[i].line]) / 2;
                break;
            }
            currentLine = letters[i].line;
          }
          if (ind !== letters[i].ind) {
            if (letters[ind]) {
              currentLength += letters[ind].extra;
            }
            currentLength += letters[i].an / 2;
            ind = letters[i].ind;
          }
          currentLength += alignment[0] * letters[i].an / 200;
          let animatorOffset = 0;
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            if (animatorProps.p.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              if (mult.length) {
                animatorOffset += animatorProps.p.v[0] * mult[0];
              } else {
                animatorOffset += animatorProps.p.v[0] * mult;
              }
            }
            if (animatorProps.a.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              if (mult.length) {
                animatorOffset += animatorProps.a.v[0] * mult[0];
              } else {
                animatorOffset += animatorProps.a.v[0] * mult;
              }
            }
          }
          flag = true;
          while (flag) {
            if (segmentLength + partialLength >= currentLength + animatorOffset || !points) {
              perc = (currentLength + animatorOffset - segmentLength) / currentPoint.partialLength;
              xPathPos = prevPoint.point[0] + (currentPoint.point[0] - prevPoint.point[0]) * perc;
              yPathPos = prevPoint.point[1] + (currentPoint.point[1] - prevPoint.point[1]) * perc;
              matrixHelper.translate(-alignment[0] * letters[i].an / 200, -(alignment[1] * yOff / 100));
              flag = false;
            } else if (points) {
              segmentLength += currentPoint.partialLength;
              pointInd += 1;
              if (pointInd >= points.length) {
                pointInd = 0;
                segmentInd += 1;
                if (!segments[segmentInd]) {
                  if (mask.v.c) {
                    pointInd = 0;
                    segmentInd = 0;
                    points = segments[segmentInd].points;
                  } else {
                    segmentLength -= currentPoint.partialLength;
                    points = null;
                  }
                } else {
                  points = segments[segmentInd].points;
                }
              }
              if (points) {
                prevPoint = currentPoint;
                currentPoint = points[pointInd];
                partialLength = currentPoint.partialLength;
              }
            }
          }
          offf = letters[i].an / 2 - letters[i].add;
          matrixHelper.translate(-offf, 0, 0);
        } else {
          offf = letters[i].an / 2 - letters[i].add;
          matrixHelper.translate(-offf, 0, 0);

          // Grouping alignment
          matrixHelper.translate(-alignment[0] * letters[i].an / 200, -alignment[1] * yOff / 100, 0);
        }

        // lineLength += letters[i].l / 2;
        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;
          if (animatorProps.t.propType) {
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
            // This condition is to prevent applying tracking to first character in each line. Might be better to use a boolean "isNewLine"
            if (xPos !== 0 || documentData.j !== 0) {
              if (this._hasMaskedPath) {
                if (mult.length) {
                  currentLength += animatorProps.t.v * mult[0];
                } else {
                  currentLength += animatorProps.t.v * mult;
                }
              } else if (mult.length) {
                xPos += animatorProps.t.v * mult[0];
              } else {
                xPos += animatorProps.t.v * mult;
              }
            }
          }
        }
        // lineLength += letters[i].l / 2;
        if (documentData.strokeWidthAnim) {
          sw = documentData.sw || 0;
        }
        if (documentData.strokeColorAnim) {
          if (documentData.sc) {
            sc = [documentData.sc[0], documentData.sc[1], documentData.sc[2]];
          } else {
            sc = [0, 0, 0];
          }
        }
        if (documentData.fillColorAnim && documentData.fc) {
          fc = [documentData.fc[0], documentData.fc[1], documentData.fc[2]];
        }
        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;
          if (animatorProps.a.propType) {
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

            if (mult.length) {
              matrixHelper.translate(-animatorProps.a.v[0] * mult[0], -animatorProps.a.v[1] * mult[1], animatorProps.a.v[2] * mult[2]);
            } else {
              matrixHelper.translate(-animatorProps.a.v[0] * mult, -animatorProps.a.v[1] * mult, animatorProps.a.v[2] * mult);
            }
          }
        }
        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;
          if (animatorProps.s.propType) {
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
            if (mult.length) {
              matrixHelper.scale(1 + ((animatorProps.s.v[0] - 1) * mult[0]), 1 + ((animatorProps.s.v[1] - 1) * mult[1]), 1);
            } else {
              matrixHelper.scale(1 + ((animatorProps.s.v[0] - 1) * mult), 1 + ((animatorProps.s.v[1] - 1) * mult), 1);
            }
          }
        }
        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;
          animatorSelector = animators[j].s;
          mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
          if (animatorProps.sk.propType) {
            if (mult.length) {
              matrixHelper.skewFromAxis(-animatorProps.sk.v * mult[0], animatorProps.sa.v * mult[1]);
            } else {
              matrixHelper.skewFromAxis(-animatorProps.sk.v * mult, animatorProps.sa.v * mult);
            }
          }
          if (animatorProps.r.propType) {
            if (mult.length) {
              matrixHelper.rotateZ(-animatorProps.r.v * mult[2]);
            } else {
              matrixHelper.rotateZ(-animatorProps.r.v * mult);
            }
          }
          if (animatorProps.ry.propType) {
            if (mult.length) {
              matrixHelper.rotateY(animatorProps.ry.v * mult[1]);
            } else {
              matrixHelper.rotateY(animatorProps.ry.v * mult);
            }
          }
          if (animatorProps.rx.propType) {
            if (mult.length) {
              matrixHelper.rotateX(animatorProps.rx.v * mult[0]);
            } else {
              matrixHelper.rotateX(animatorProps.rx.v * mult);
            }
          }
          if (animatorProps.o.propType) {
            if (mult.length) {
              elemOpacity += ((animatorProps.o.v) * mult[0] - elemOpacity) * mult[0];
            } else {
              elemOpacity += ((animatorProps.o.v) * mult - elemOpacity) * mult;
            }
          }
          if (documentData.strokeWidthAnim && animatorProps.sw.propType) {
            if (mult.length) {
              sw += animatorProps.sw.v * mult[0];
            } else {
              sw += animatorProps.sw.v * mult;
            }
          }
          if (documentData.strokeColorAnim && animatorProps.sc.propType) {
            for (k = 0; k < 3; k += 1) {
              if (mult.length) {
                sc[k] = sc[k] + (animatorProps.sc.v[k] - sc[k]) * mult[0];
              } else {
                sc[k] = sc[k] + (animatorProps.sc.v[k] - sc[k]) * mult;
              }
            }
          }
          if (documentData.fillColorAnim && documentData.fc) {
            if (animatorProps.fc.propType) {
              for (k = 0; k < 3; k += 1) {
                if (mult.length) {
                  fc[k] = fc[k] + (animatorProps.fc.v[k] - fc[k]) * mult[0];
                } else {
                  fc[k] = fc[k] + (animatorProps.fc.v[k] - fc[k]) * mult;
                }
              }
            }
            if (animatorProps.fh.propType) {
              if (mult.length) {
                fc = addHueToRGB(fc, animatorProps.fh.v * mult[0]);
              } else {
                fc = addHueToRGB(fc, animatorProps.fh.v * mult);
              }
            }
            if (animatorProps.fs.propType) {
              if (mult.length) {
                fc = addSaturationToRGB(fc, animatorProps.fs.v * mult[0]);
              } else {
                fc = addSaturationToRGB(fc, animatorProps.fs.v * mult);
              }
            }
            if (animatorProps.fb.propType) {
              if (mult.length) {
                fc = addBrightnessToRGB(fc, animatorProps.fb.v * mult[0]);
              } else {
                fc = addBrightnessToRGB(fc, animatorProps.fb.v * mult);
              }
            }
          }
        }

        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;

          if (animatorProps.p.propType) {
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
            if (this._hasMaskedPath) {
              if (mult.length) {
                matrixHelper.translate(0, animatorProps.p.v[1] * mult[0], -animatorProps.p.v[2] * mult[1]);
              } else {
                matrixHelper.translate(0, animatorProps.p.v[1] * mult, -animatorProps.p.v[2] * mult);
              }
            } else if (mult.length) {
              matrixHelper.translate(animatorProps.p.v[0] * mult[0], animatorProps.p.v[1] * mult[1], -animatorProps.p.v[2] * mult[2]);
            } else {
              matrixHelper.translate(animatorProps.p.v[0] * mult, animatorProps.p.v[1] * mult, -animatorProps.p.v[2] * mult);
            }
          }
        }
        if (documentData.strokeWidthAnim) {
          letterSw = sw < 0 ? 0 : sw;
        }
        if (documentData.strokeColorAnim) {
          letterSc = 'rgb(' + Math.round(sc[0] * 255) + ',' + Math.round(sc[1] * 255) + ',' + Math.round(sc[2] * 255) + ')';
        }
        if (documentData.fillColorAnim && documentData.fc) {
          letterFc = 'rgb(' + Math.round(fc[0] * 255) + ',' + Math.round(fc[1] * 255) + ',' + Math.round(fc[2] * 255) + ')';
        }

        if (this._hasMaskedPath) {
          matrixHelper.translate(0, -documentData.ls);

          matrixHelper.translate(0, alignment[1] * yOff / 100 + yPos, 0);
          if (textData.p.p) {
            tanAngle = (currentPoint.point[1] - prevPoint.point[1]) / (currentPoint.point[0] - prevPoint.point[0]);
            let rot = Math.atan(tanAngle) * 180 / Math.PI;
            if (currentPoint.point[0] < prevPoint.point[0]) {
              rot += 180;
            }
            matrixHelper.rotate(-rot * Math.PI / 180);
          }
          matrixHelper.translate(xPathPos, yPathPos, 0);
          currentLength -= alignment[0] * letters[i].an / 200;
          if (letters[i + 1] && ind !== letters[i + 1].ind) {
            currentLength += letters[i].an / 2;
            currentLength += documentData.tr / 1000 * documentData.finalSize;
          }
        } else {
          matrixHelper.translate(xPos, yPos, 0);

          if (documentData.ps) {
            // matrixHelper.translate(documentData.ps[0],documentData.ps[1],0);
            matrixHelper.translate(documentData.ps[0], documentData.ps[1] + documentData.ascent, 0);
          }
          // eslint-disable-next-line default-case
          switch (documentData.j) {
            case 1:
              matrixHelper.translate(letters[i].animatorJustifyOffset + documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[letters[i].line]), 0, 0);
              break;
            case 2:
              matrixHelper.translate(letters[i].animatorJustifyOffset + documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[letters[i].line]) / 2, 0, 0);
              break;
          }
          matrixHelper.translate(0, -documentData.ls);
          matrixHelper.translate(offf, 0, 0);
          matrixHelper.translate(alignment[0] * letters[i].an / 200, alignment[1] * yOff / 100, 0);
          xPos += letters[i].l + documentData.tr / 1000 * documentData.finalSize;
        }
        if (renderType === 'html') {
          letterM = matrixHelper.toCSS();
        } else if (renderType === 'svg') {
          letterM = matrixHelper.to2dCSS();
        } else {
          letterP = [matrixHelper.props[0], matrixHelper.props[1], matrixHelper.props[2], matrixHelper.props[3], matrixHelper.props[4], matrixHelper.props[5], matrixHelper.props[6], matrixHelper.props[7], matrixHelper.props[8], matrixHelper.props[9], matrixHelper.props[10], matrixHelper.props[11], matrixHelper.props[12], matrixHelper.props[13], matrixHelper.props[14], matrixHelper.props[15]];
        }
        letterO = elemOpacity;
      }

      if (renderedLettersCount <= i) {
        letterValue = new LetterProps(letterO, letterSw, letterSc, letterFc, letterM, letterP);
        this.renderedLetters.push(letterValue);
        renderedLettersCount += 1;
        this.lettersChangedFlag = true;
      } else {
        letterValue = this.renderedLetters[i];
        this.lettersChangedFlag = letterValue.update(letterO, letterSw, letterSc, letterFc, letterM, letterP) || this.lettersChangedFlag;
      }
    }
  }

  getValue() {
    if (this._elem.globalData.frameId === this._frameId) {
      return;
    }
    this._frameId = this._elem.globalData.frameId;
    this.iterateDynamicProperties();
  }

  mHelper = new Matrix()

  defaultPropsArray = []
}
