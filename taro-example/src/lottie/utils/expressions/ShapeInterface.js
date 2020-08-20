'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (shapes, view, propertyGroup) {
  var interfaces = void 0;
  function _interfaceFunction(value) {
    if (typeof value === 'number') {
      return interfaces[value - 1];
    }
    var i = 0;
    var len = interfaces.length;
    while (i < len) {
      if (interfaces[i]._name === value) {
        return interfaces[i];
      }
      i += 1;
    }
  }
  _interfaceFunction.propertyGroup = propertyGroup;
  interfaces = iterateElements(shapes, view, _interfaceFunction);
  _interfaceFunction.numProperties = interfaces.length;
  return _interfaceFunction;
};

var _ExpressionValueFactory = require('../expressions/ExpressionValueFactory');

function iterateElements(shapes, view, propertyGroup) {
  var arr = [];
  var i = void 0;
  var len = shapes ? shapes.length : 0;
  for (i = 0; i < len; i += 1) {
    if (shapes[i].ty === 'gr') {
      arr.push(groupInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'fl') {
      arr.push(fillInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'st') {
      arr.push(strokeInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'tm') {
      arr.push(trimInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'tr') {
      // arr.push(transformInterfaceFactory(shapes[i],view[i],propertyGroup));
    } else if (shapes[i].ty === 'el') {
      arr.push(ellipseInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'sr') {
      arr.push(starInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'sh') {
      arr.push(pathInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rc') {
      arr.push(rectInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rd') {
      arr.push(roundedInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rp') {
      arr.push(repeaterInterfaceFactory(shapes[i], view[i], propertyGroup));
    }
  }
  return arr;
} /* eslint no-use-before-define: 0 */


function contentsInterfaceFactory(shape, view, propertyGroup) {
  var interfaces = void 0;
  var interfaceFunction = function _interfaceFunction(value) {
    var i = 0;
    var len = interfaces.length;
    while (i < len) {
      if (interfaces[i]._name === value || interfaces[i].mn === value || interfaces[i].propertyIndex === value || interfaces[i].ix === value || interfaces[i].ind === value) {
        return interfaces[i];
      }
      i += 1;
    }
    if (typeof value === 'number') {
      return interfaces[value - 1];
    }
  };
  interfaceFunction.propertyGroup = function (val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(val - 1);
  };
  interfaces = iterateElements(shape.it, view.it, interfaceFunction.propertyGroup);
  interfaceFunction.numProperties = interfaces.length;
  interfaceFunction.propertyIndex = shape.cix;
  interfaceFunction._name = shape.nm;

  return interfaceFunction;
}

function groupInterfaceFactory(shape, view, propertyGroup) {
  var interfaceFunction = function _interfaceFunction(value) {
    switch (value) {
      case 'ADBE Vectors Group':
      case 'Contents':
      case 2:
        return interfaceFunction.content;
      // Not necessary for now. Keeping them here in case a new case appears
      // case 'ADBE Vector Transform Group':
      // case 3:
      default:
        return interfaceFunction.transform;
    }
  };
  interfaceFunction.propertyGroup = function (val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(val - 1);
  };
  var content = contentsInterfaceFactory(shape, view, interfaceFunction.propertyGroup);
  var transformInterface = transformInterfaceFactory(shape.it[shape.it.length - 1], view.it[view.it.length - 1], interfaceFunction.propertyGroup);
  interfaceFunction.content = content;
  interfaceFunction.transform = transformInterface;
  Object.defineProperty(interfaceFunction, '_name', {
    get: function get() {
      return shape.nm;
    }
  });
  // interfaceFunction.content = interfaceFunction;
  interfaceFunction.numProperties = shape.np;
  interfaceFunction.propertyIndex = shape.ix;
  interfaceFunction.nm = shape.nm;
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function fillInterfaceFactory(shape, view, propertyGroup) {
  function interfaceFunction(val) {
    if (val === 'Color' || val === 'color') {
      return interfaceFunction.color;
    }
    if (val === 'Opacity' || val === 'opacity') {
      return interfaceFunction.opacity;
    }
  }
  Object.defineProperties(interfaceFunction, {
    color: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.c)
    },
    opacity: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.o)
    },
    _name: {
      value: shape.nm
    },
    mn: {
      value: shape.mn
    }
  });

  view.c.setGroupProperty(propertyGroup);
  view.o.setGroupProperty(propertyGroup);
  return interfaceFunction;
}
var ob = {};
function strokeInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return ob;
    }
    return propertyGroup(val - 1);
  }
  function _dashPropertyGroup(val) {
    if (val === 1) {
      return dashOb;
    }
    return _propertyGroup(val - 1);
  }
  function addPropertyToDashOb(i) {
    Object.defineProperty(dashOb, shape.d[i].nm, {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.d.dataProps[i].p)
    });
  }
  var i = void 0;
  var len = shape.d ? shape.d.length : 0;
  var dashOb = {};
  for (i = 0; i < len; i += 1) {
    addPropertyToDashOb(i);
    view.d.dataProps[i].p.setGroupProperty(_dashPropertyGroup);
  }

  function interfaceFunction(val) {
    if (val === 'Color' || val === 'color') {
      return interfaceFunction.color;
    }
    if (val === 'Opacity' || val === 'opacity') {
      return interfaceFunction.opacity;
    }
    if (val === 'Stroke Width' || val === 'stroke width') {
      return interfaceFunction.strokeWidth;
    }
  }
  Object.defineProperties(interfaceFunction, {
    color: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.c)
    },
    opacity: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.o)
    },
    strokeWidth: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.w)
    },
    dash: {
      get: function get() {
        return dashOb;
      }
    },
    _name: {
      value: shape.nm
    },
    mn: {
      value: shape.mn
    }
  });

  view.c.setGroupProperty(_propertyGroup);
  view.o.setGroupProperty(_propertyGroup);
  view.w.setGroupProperty(_propertyGroup);
  return interfaceFunction;
}

function trimInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  interfaceFunction.propertyIndex = shape.ix;

  view.s.setGroupProperty(_propertyGroup);
  view.e.setGroupProperty(_propertyGroup);
  view.o.setGroupProperty(_propertyGroup);

  function interfaceFunction(val) {
    if (val === shape.e.ix || val === 'End' || val === 'end') {
      return interfaceFunction.end;
    }
    if (val === shape.s.ix) {
      return interfaceFunction.start;
    }
    if (val === shape.o.ix) {
      return interfaceFunction.offset;
    }
  }
  interfaceFunction.propertyIndex = shape.ix;
  interfaceFunction.propertyGroup = propertyGroup;

  Object.defineProperties(interfaceFunction, {
    start: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.s)
    },
    end: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.e)
    },
    offset: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.o)
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function transformInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  view.transform.mProps.o.setGroupProperty(_propertyGroup);
  view.transform.mProps.p.setGroupProperty(_propertyGroup);
  view.transform.mProps.a.setGroupProperty(_propertyGroup);
  view.transform.mProps.s.setGroupProperty(_propertyGroup);
  view.transform.mProps.r.setGroupProperty(_propertyGroup);
  if (view.transform.mProps.sk) {
    view.transform.mProps.sk.setGroupProperty(_propertyGroup);
    view.transform.mProps.sa.setGroupProperty(_propertyGroup);
  }
  view.transform.op.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.a.ix === value || value === 'Anchor Point') {
      return interfaceFunction.anchorPoint;
    }
    if (shape.o.ix === value || value === 'Opacity') {
      return interfaceFunction.opacity;
    }
    if (shape.p.ix === value || value === 'Position') {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value || value === 'Rotation' || value === 'ADBE Vector Rotation') {
      return interfaceFunction.rotation;
    }
    if (shape.s.ix === value || value === 'Scale') {
      return interfaceFunction.scale;
    }
    if (shape.sk && shape.sk.ix === value || value === 'Skew') {
      return interfaceFunction.skew;
    }
    if (shape.sa && shape.sa.ix === value || value === 'Skew Axis') {
      return interfaceFunction.skewAxis;
    }
  }
  Object.defineProperties(interfaceFunction, {
    opacity: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.transform.mProps.o)
    },
    position: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.transform.mProps.p)
    },
    anchorPoint: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.transform.mProps.a)
    },
    scale: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.transform.mProps.s)
    },
    rotation: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.transform.mProps.r)
    },
    skew: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.transform.mProps.sk)
    },
    skewAxis: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(view.transform.mProps.sa)
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.ty = 'tr';
  interfaceFunction.mn = shape.mn;
  interfaceFunction.propertyGroup = propertyGroup;
  return interfaceFunction;
}

function ellipseInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  interfaceFunction.propertyIndex = shape.ix;
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  prop.s.setGroupProperty(_propertyGroup);
  prop.p.setGroupProperty(_propertyGroup);
  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.s.ix === value) {
      return interfaceFunction.size;
    }
  }

  Object.defineProperties(interfaceFunction, {
    size: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.s)
    },
    position: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.p)
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function starInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  interfaceFunction.propertyIndex = shape.ix;
  prop.or.setGroupProperty(_propertyGroup);
  prop.os.setGroupProperty(_propertyGroup);
  prop.pt.setGroupProperty(_propertyGroup);
  prop.p.setGroupProperty(_propertyGroup);
  prop.r.setGroupProperty(_propertyGroup);
  if (shape.ir) {
    prop.ir.setGroupProperty(_propertyGroup);
    prop.is.setGroupProperty(_propertyGroup);
  }

  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value) {
      return interfaceFunction.rotation;
    }
    if (shape.pt.ix === value) {
      return interfaceFunction.points;
    }
    if (shape.or.ix === value || value === 'ADBE Vector Star Outer Radius') {
      return interfaceFunction.outerRadius;
    }
    if (shape.os.ix === value) {
      return interfaceFunction.outerRoundness;
    }
    if (shape.ir && (shape.ir.ix === value || value === 'ADBE Vector Star Inner Radius')) {
      return interfaceFunction.innerRadius;
    }
    if (shape.is && shape.is.ix === value) {
      return interfaceFunction.innerRoundness;
    }
  }

  Object.defineProperties(interfaceFunction, {
    position: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.p)
    },
    rotation: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.r)
    },
    points: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.pt)
    },
    outerRadius: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.or)
    },
    outerRoundness: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.os)
    },
    innerRadius: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.ir)
    },
    innerRoundness: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.is)
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function rectInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  interfaceFunction.propertyIndex = shape.ix;
  prop.p.setGroupProperty(_propertyGroup);
  prop.s.setGroupProperty(_propertyGroup);
  prop.r.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value) {
      return interfaceFunction.roundness;
    }
    if (shape.s.ix === value || value === 'Size' || value === 'ADBE Vector Rect Size') {
      return interfaceFunction.size;
    }
  }
  Object.defineProperties(interfaceFunction, {
    position: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.p)
    },
    roundness: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.r)
    },
    size: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.s)
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function roundedInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view;
  interfaceFunction.propertyIndex = shape.ix;
  prop.rd.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.r.ix === value || value === 'Round Corners 1') {
      return interfaceFunction.radius;
    }
  }
  Object.defineProperties(interfaceFunction, {
    radius: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.rd)
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function repeaterInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view;
  interfaceFunction.propertyIndex = shape.ix;
  prop.c.setGroupProperty(_propertyGroup);
  prop.o.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.c.ix === value || value === 'Copies') {
      return interfaceFunction.copies;
    }
    if (shape.o.ix === value || value === 'Offset') {
      return interfaceFunction.offset;
    }
  }
  Object.defineProperties(interfaceFunction, {
    copies: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.c)
    },
    offset: {
      get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(prop.o)
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function pathInterfaceFactory(shape, view, propertyGroup) {
  var prop = view.sh;
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  prop.setGroupProperty(_propertyGroup);

  function interfaceFunction(val) {
    if (val === 'Shape' || val === 'shape' || val === 'Path' || val === 'path' || val === 'ADBE Vector Shape' || val === 2) {
      return interfaceFunction.path;
    }
  }
  Object.defineProperties(interfaceFunction, {
    path: {
      get: function get() {
        if (prop.k) {
          prop.getValue();
        }
        return prop;
      }
    },
    shape: {
      get: function get() {
        if (prop.k) {
          prop.getValue();
        }
        return prop;
      }
    },
    _name: {
      value: shape.nm
    },
    ix: {
      value: shape.ix
    },
    propertyIndex: {
      value: shape.ix
    },
    mn: {
      value: shape.mn
    }
  });
  return interfaceFunction;
}