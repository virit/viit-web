interface GridBreakPoint {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

const BreakPoint: GridBreakPoint = {
  xs: 576,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

type BreakPointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export function checkBreakPoint(name: BreakPointType | BreakPointType[], width: number) {
  const checkFunction = (item:BreakPointType) => {
    switch (item) {
      case 'xs':
        return width < BreakPoint.xs;
      case 'sm':
        return width < BreakPoint.md && width >= BreakPoint.sm;
      case 'md':
        return width < BreakPoint.lg && width >= BreakPoint.md;
      case 'lg':
        return width < BreakPoint.xl && width >= BreakPoint.lg;
      case 'xl':
        return width < BreakPoint.xxl && width >= BreakPoint.xl;
      case 'xxl':
        return width >= BreakPoint.xxl;
      default:
        return false;
    }
  };
  if (Array.isArray(name)) {
    return name.filter(it => checkFunction(it)).length !== 0;
  } else {
    return checkFunction(name);
  }
}
