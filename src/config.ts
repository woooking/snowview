
export const SERVER_URL = 'http://162.105.88.28:8080';
export const DOCUMENT_SEARCH_URL = `${SERVER_URL}/docSearch`;
export const CODE_SEARCH_URL = `${SERVER_URL}/codeSearch`;
export const NODE_INFO_URL = `${SERVER_URL}/node`;
export const RELATION_LIST_URL = `${SERVER_URL}/relationList`;
export const NAV_URL = `${SERVER_URL}/nav`;

export const DOC_PREDEFINED_QUERIES = [
    '判断资源路径并生成ras压缩包',
	'编辑web服务资源的可信等级并保存',
];

export const GRAPH_PREDEFINED_QUERIES = [
	'谁修改过RasPackager类',
	'谁修改过调用了setTags函数的类',
	'判断资源路径并生成ras压缩包',
	'编辑web服务资源的可信等级并保存',
	'根据日期生成资源可信等级的统计图表'
];