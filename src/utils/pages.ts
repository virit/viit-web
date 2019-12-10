export interface PageQuery {
  page: {
    current: number | undefined;
    size: number | undefined;
  };
  fields: any;
}

export const toQueryParams = (params: PageQuery): any => {
  const queryParams: any = {};

  const handleItem = (obj: any, prefix: string = '') => {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'object') {
        handleItem(value, key);
      } else {
        if (value === '') {
          continue;
        }
        if (prefix === '') {
          queryParams[key] = value;
        } else {
          queryParams[prefix + '.' + key] = value;
        }
      }
    }
  };
  handleItem(params);
  return queryParams;
};
