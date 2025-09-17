
(function () {
    'use strict';

    const DEFAULT_FETCH_OPTIONS = {
        headers: { accept: 'application/json, text/plain, */*' },
        credentials: 'omit',
        cache: 'no-store',
        mode: 'cors',
        referrerPolicy: 'no-referrer'
    };

    const DIRECT_ENDPOINTS = [
        createEndpoint('https://www.telx.network/api/pools'),
        createEndpoint('https://telx.network/api/pools'),
        createEndpoint('https://api.telx.network/pools'),
        createEndpoint('https://www.telx.network/pools'),
        createEndpoint('https://telx.network/pools')
    ];

    const PROXY_BUILDERS = [
        function (url) {
            return { url: 'https://corsproxy.io/?' + url, proxied: true };
        },
        function (url) {
            return { url: 'https://thingproxy.freeboard.io/fetch/' + url, proxied: true };
        },
        function (url) {
            return {
                url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url),
                proxied: true,
                preferText: true
            };
        }
    ];

    const ENDPOINTS = (function () {
        const list = buildEndpointList(DIRECT_ENDPOINTS, PROXY_BUILDERS);
        const override = getOverrideEndpoint();
        if (override && list.every(function (item) { return item.url !== override; })) {
            list.unshift(createEndpoint(override));
        }
        return list;
    })();

    function createEndpoint(url) {
        return { url: url, label: url };
    }

    function buildEndpointList(baseEndpoints, proxyBuilders) {
        const seen = Object.create(null);
        const list = [];

        if (Array.isArray(baseEndpoints)) {
            baseEndpoints.forEach(function (entry) {
                if (!entry || !entry.url) {
                    return;
                }
                if (seen[entry.url]) {
                    return;
                }
                list.push({
                    url: entry.url,
                    label: entry.label || entry.url,
                    proxied: Boolean(entry.proxied),
                    preferText: Boolean(entry.preferText),
                    headers: entry.headers || null,
                    mode: entry.mode,
                    credentials: entry.credentials,
                    cache: entry.cache,
                    referrerPolicy: entry.referrerPolicy
                });
                seen[entry.url] = true;
            });
        }

        if (!Array.isArray(baseEndpoints)) {
            return list;
        }

        if (Array.isArray(proxyBuilders) && proxyBuilders.length) {
            baseEndpoints.forEach(function (entry) {
                if (!entry || !entry.url) {
                    return;
                }
                proxyBuilders.forEach(function (builder) {
                    try {
                        const built = builder(entry.url);
                        if (!built || !built.url || seen[built.url]) {
                            return;
                        }
                        list.push({
                            url: built.url,
                            label: built.label || entry.label || entry.url,
                            proxied: built.proxied !== false,
                            preferText: Boolean(built.preferText),
                            headers: built.headers || null,
                            mode: built.mode,
                            credentials: built.credentials,
                            cache: built.cache,
                            referrerPolicy: built.referrerPolicy
                        });
                        seen[built.url] = true;
                    } catch (error) {
                        // ignore builder errors
                    }
                });
            });
        }

        return list;
    }

    function buildFetchOptions(entry) {
        const options = {
            headers: Object.assign({}, DEFAULT_FETCH_OPTIONS.headers),
            credentials: DEFAULT_FETCH_OPTIONS.credentials,
            cache: DEFAULT_FETCH_OPTIONS.cache,
            mode: DEFAULT_FETCH_OPTIONS.mode,
            referrerPolicy: DEFAULT_FETCH_OPTIONS.referrerPolicy
        };

        if (entry && entry.headers) {
            options.headers = Object.assign(options.headers, entry.headers);
        }
        if (entry && entry.credentials) {
            options.credentials = entry.credentials;
        }
        if (entry && entry.cache) {
            options.cache = entry.cache;
        }
        if (entry && entry.mode) {
            options.mode = entry.mode;
        }
        if (entry && entry.referrerPolicy) {
            options.referrerPolicy = entry.referrerPolicy;
        }

        return options;
    }

    function getOverrideEndpoint() {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            const params = new URLSearchParams(window.location.search || '');
            const queryValue = params.get('telxEndpoint');
            if (queryValue && queryValue.trim()) {
                return queryValue.trim();
            }
        } catch (error) {
            // ignore malformed query strings
        }

        if (window.TELX_POOLS_ENDPOINT && typeof window.TELX_POOLS_ENDPOINT === 'string') {
            const globalValue = window.TELX_POOLS_ENDPOINT.trim();
            if (globalValue) {
                return globalValue;
            }
        }

        if (typeof document !== 'undefined' && document.body) {
            const attributeValue = document.body.getAttribute('data-telx-endpoint');
            if (attributeValue && attributeValue.trim()) {
                return attributeValue.trim();
            }
        }

        return null;
    }

    const METRIC_CONFIG = {
        tvl: {
            type: 'currency',
            valueKeywords: ['tvl', 'totalvalue', 'total_liquidity', 'liquidity', 'totalvaluelocked'],
            valueOptions: { preferIncludes: ['usd', 'value'], avoidIncludes: ['tel'] },
            deltaKeywords: ['tvlchange24h', 'tvlusdchange24h', 'tvldelta', 'totalvaluechange', 'tvlchange'],
            deltaOptions: { avoidIncludes: ['percent', 'pct'] },
            percentKeywords: ['tvlchangepercent24h', 'tvlpercentchange24h', 'tvlpercentchange', 'tvlchangepercent', 'tvlchangepct', 'tvlpctchange', 'tvlchange24hpercent'],
            percentOptions: { preferIncludes: ['percent', 'pct'] },
            previousKeywords: ['tvl24hago', 'tvlusd24hago', 'tvllast24h', 'tvlprevious24h']
        },
        staked: {
            type: 'token',
            symbol: 'TEL',
            valueKeywords: ['staked', 'stakedtel', 'staketotal', 'staking', 'stakedbalance', 'stakedamount'],
            valueOptions: { preferIncludes: ['tel', 'amount'], avoidIncludes: ['usd'] },
            deltaKeywords: ['stakedchange24h', 'staketotalchange24h', 'stakedelta'],
            deltaOptions: { avoidIncludes: ['percent', 'pct'] },
            percentKeywords: ['stakedpercentchange24h', 'stakedchangepercent', 'stakingpercentchange'],
            percentOptions: { preferIncludes: ['percent', 'pct'] },
            previousKeywords: ['staked24hago', 'staketotal24hago']
        },
        volume: {
            type: 'currency',
            valueKeywords: ['volume24h', 'volume', 'swapvolume', 'dailyvolume', '24hvolume'],
            valueOptions: { preferIncludes: ['usd'], avoidIncludes: ['tel'] },
            deltaKeywords: ['volumechange24h', 'volumedelta', 'volumeusdchange24h', 'swapvolumechange24h'],
            deltaOptions: { avoidIncludes: ['percent', 'pct'] },
            percentKeywords: ['volumepercentchange24h', 'volumechangepercent', 'volumechangepct', 'volumechange24hpercent'],
            percentOptions: { preferIncludes: ['percent', 'pct'] },
            previousKeywords: ['volume24hago', 'volumeusd24hago']
        },
        fees: {
            type: 'currency',
            valueKeywords: ['fees24h', 'fees', 'swapfees', 'dailyfees', 'feevolume'],
            valueOptions: { preferIncludes: ['usd'], avoidIncludes: ['tel'] },
            deltaKeywords: ['feeschange24h', 'feedelta', 'feeusdchange24h'],
            deltaOptions: { avoidIncludes: ['percent', 'pct'] },
            percentKeywords: ['feespercentchange24h', 'feeschangepercent', 'feechangepct', 'feeschange24hpercent'],
            percentOptions: { preferIncludes: ['percent', 'pct'] },
            previousKeywords: ['fees24hago', 'feesusd24hago']
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const statValueElement = document.querySelector('[data-stat-value]');
        const tableBody = document.querySelector('[data-pool-table-body]');
        if (!statValueElement && !tableBody) {
            return;
        }

        fetchPoolData()
            .then(function (rawPools) {
                const preparedPools = preparePools(rawPools);
                if (!preparedPools.length) {
                    throw new Error('No TELx pools returned from source.');
                }
                if (statValueElement) {
                    updateHomeStats(preparedPools);
                }
                if (tableBody) {
                    updatePoolsTable(preparedPools);
                }
            })
            .catch(handleError);
    });

    function fetchPoolData() {
        if (!ENDPOINTS.length) {
            return Promise.reject(new Error('No TELx endpoints configured.'));
        }
        return tryEndpoint(0);
    }

    function tryEndpoint(index) {
        if (index >= ENDPOINTS.length) {
            return Promise.reject(new Error('All TELx endpoints failed.'));
        }

        const entry = ENDPOINTS[index] || {};
        const url = entry.url;

        if (!url) {
            return tryEndpoint(index + 1);
        }

        return fetch(url, buildFetchOptions(entry))
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return parsePoolResponse(response, entry);
            })
            .then(function (payload) {
                const pools = normalizePools(payload);
                if (pools && pools.length) {
                    return pools;
                }
                throw new Error('No pools in payload.');
            })
            .catch(function (error) {
                const context = entry.proxied ? 'proxy for ' + (entry.label || url) : entry.label || url;
                console.warn('[TELx pools] Failed to load from', url, '(' + context + ')', error);
                return tryEndpoint(index + 1);
            });
    }

    function parsePoolResponse(response, entry) {
        const contentType = (response.headers && response.headers.get('content-type')) || '';
        const forceText = entry && entry.preferText;

        if (!forceText && contentType.indexOf('application/json') !== -1) {
            return response.json();
        }

        return response.text().then(function (text) {
            const trimmed = (text || '').trim();
            if (!trimmed) {
                throw new Error('Empty response body.');
            }

            try {
                return JSON.parse(trimmed);
            } catch (error) {
                const payloads = extractJsonFromHtml(trimmed);
                for (let i = 0; i < payloads.length; i++) {
                    const pools = normalizePools(payloads[i]);
                    if (pools && pools.length) {
                        return payloads[i];
                    }
                }
            }

            throw new Error('Response did not contain parseable TELx data.');
        });
    }

    function extractJsonFromHtml(html) {
        const results = [];
        if (!html) {
            return results;
        }
        const scriptRegex = new RegExp("<script[^>]*type=['\"]application\\/(?:json|ld\\+json)['\"][^>]*>([\\s\\S]*?)<\\/script>", 'gi');
        let scriptMatch;
        while ((scriptMatch = scriptRegex.exec(html)) !== null) {
            const raw = (scriptMatch[1] || '').trim();
            if (!raw) {
                continue;
            }
            try {
                results.push(JSON.parse(raw));
                continue;
            } catch (error) {
                try {
                    const unescaped = raw
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&#x27;/g, "'")
                        .replace(/&#39;/g, "'")
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>');
                    results.push(JSON.parse(unescaped));
                } catch (err) {
                    // ignore malformed JSON blocks
                }
            }
        }
        const windowRegex = new RegExp('(?:__NEXT_DATA__|__NUXT__|__APOLLO_STATE__)\\s*=\\s*(\\{[\\s\\S]*?\\})(?:;|<\\/script>)', 'g');
        let windowMatch;
        while ((windowMatch = windowRegex.exec(html)) !== null) {
            const block = (windowMatch[1] || '').trim();
            if (!block) {
                continue;
            }
            try {
                results.push(JSON.parse(block));
            } catch (error) {
                // ignore
            }
        }
        return results;
    }

    function normalizePools(data) {
        if (!data) {
            return [];
        }
        if (Array.isArray(data)) {
            return data.filter(function (item) { return item && typeof item === 'object'; });
        }
        const directKeys = ['pools', 'data', 'result', 'items', 'records', 'nodes', 'edges'];
        for (let i = 0; i < directKeys.length; i++) {
            const key = directKeys[i];
            const value = data[key];
            if (Array.isArray(value)) {
                const nested = normalizePools(value);
                if (nested.length) {
                    return nested;
                }
            } else if (value && typeof value === 'object') {
                const nestedObject = normalizePools(value);
                if (nestedObject.length) {
                    return nestedObject;
                }
            }
        }
        if (data.props && typeof data.props === 'object') {
            const fromProps = normalizePools(data.props);
            if (fromProps.length) {
                return fromProps;
            }
        }
        if (data.pageProps && typeof data.pageProps === 'object') {
            const fromPageProps = normalizePools(data.pageProps);
            if (fromPageProps.length) {
                return fromPageProps;
            }
        }
        if (data.attributes && typeof data.attributes === 'object') {
            const fromAttributes = normalizePools(data.attributes);
            if (fromAttributes.length) {
                return fromAttributes;
            }
        }
        const found = findPoolsInObject(data, new WeakSet());
        if (Array.isArray(found)) {
            return found.filter(function (item) { return item && typeof item === 'object'; });
        }
        return [];
    }

    function findPoolsInObject(node, visited) {
        if (!node || typeof node !== 'object') {
            return null;
        }
        if (visited.has(node)) {
            return null;
        }
        visited.add(node);
        if (Array.isArray(node)) {
            if (node.length && typeof node[0] === 'object') {
                const sampleKeys = Object.keys(node[0]).map(function (key) { return key.toLowerCase(); });
                const hasIdentity = sampleKeys.some(function (key) {
                    return key.indexOf('pool') !== -1 || key.indexOf('pair') !== -1 || key.indexOf('name') !== -1 || key.indexOf('token') !== -1;
                });
                const hasMetrics = sampleKeys.some(function (key) {
                    return key.indexOf('tvl') !== -1 || key.indexOf('volume') !== -1 || key.indexOf('fee') !== -1 || key.indexOf('staked') !== -1;
                });
                if (hasIdentity && hasMetrics) {
                    return node;
                }
            }
            for (let i = 0; i < node.length; i++) {
                const nested = findPoolsInObject(node[i], visited);
                if (nested) {
                    return nested;
                }
            }
            return null;
        }
        for (const key in node) {
            if (!Object.prototype.hasOwnProperty.call(node, key)) {
                continue;
            }
            const value = node[key];
            if (!value) {
                continue;
            }
            if (Array.isArray(value)) {
                const arrayResult = findPoolsInObject(value, visited);
                if (arrayResult) {
                    return arrayResult;
                }
            } else if (typeof value === 'object') {
                const objectResult = findPoolsInObject(value, visited);
                if (objectResult) {
                    return objectResult;
                }
            }
        }
        return null;
    }

    function preparePools(rawPools) {
        return rawPools
            .filter(function (pool) { return pool && typeof pool === 'object'; })
            .map(function (pool) {
                return { raw: pool, flat: flattenPool(pool) };
            });
    }

    function flattenPool(pool) {
        const numbers = [];
        const strings = [];
        const visited = new WeakSet();

        function walk(value, path) {
            if (value && typeof value === 'object') {
                if (visited.has(value)) {
                    return;
                }
                visited.add(value);
            }
            if (value === null || value === undefined) {
                return;
            }
            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    const nextPath = path ? path + '[' + i + ']' : '[' + i + ']';
                    walk(value[i], nextPath);
                }
                return;
            }
            if (value && typeof value === 'object') {
                for (const key in value) {
                    if (!Object.prototype.hasOwnProperty.call(value, key)) {
                        continue;
                    }
                    const nestedPath = path ? path + '.' + key : key;
                    walk(value[key], nestedPath);
                }
                return;
            }
            const lowerPath = (path || '').toLowerCase();
            if (typeof value === 'number' && isFinite(value)) {
                numbers.push({ path: lowerPath, value: value });
                return;
            }
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (!trimmed) {
                    return;
                }
                strings.push({ path: lowerPath, value: trimmed });
                const numeric = Number(trimmed.replace(/[^0-9eE+\-\.]/g, ''));
                if (!isNaN(numeric) && trimmed.replace(/[^0-9]/g, '') !== '') {
                    numbers.push({ path: lowerPath, value: numeric });
                }
            }
        }

        walk(pool, '');
        return { numbers: numbers, strings: strings };
    }

    function findNumber(entries, keywords, options) {
        if (!entries || !entries.length || !keywords || !keywords.length) {
            return null;
        }
        const normalizedKeywords = keywords.map(function (keyword) { return keyword.toLowerCase(); });
        const preferIncludes = (options && options.preferIncludes) ? options.preferIncludes.map(function (value) { return value.toLowerCase(); }) : [];
        const avoidIncludes = (options && options.avoidIncludes) ? options.avoidIncludes.map(function (value) { return value.toLowerCase(); }) : [];

        let best = null;
        let bestScore = Infinity;

        entries.forEach(function (entry) {
            if (!Number.isFinite(entry.value)) {
                return;
            }
            const path = entry.path || '';
            if (avoidIncludes.length && avoidIncludes.some(function (avoid) { return path.indexOf(avoid) !== -1; })) {
                return;
            }
            for (let i = 0; i < normalizedKeywords.length; i++) {
                const keyword = normalizedKeywords[i];
                let score = null;
                if (path === keyword) {
                    score = i * 10;
                } else if (path.endsWith(keyword)) {
                    score = i * 10 + 1;
                } else if (path.indexOf(keyword) !== -1) {
                    score = i * 10 + 2;
                }
                if (score !== null) {
                    if (preferIncludes.length && !preferIncludes.some(function (pref) { return path.indexOf(pref) !== -1; })) {
                        score += 100;
                    }
                    if (score < bestScore) {
                        bestScore = score;
                        best = entry;
                    }
                    break;
                }
            }
        });
        return best;
    }

    function findString(entries, keywords, options) {
        if (!entries || !entries.length || !keywords || !keywords.length) {
            return undefined;
        }
        const normalizedKeywords = keywords.map(function (keyword) { return keyword.toLowerCase(); });
        const preferIncludes = (options && options.preferIncludes) ? options.preferIncludes.map(function (value) { return value.toLowerCase(); }) : [];

        let best = null;
        let bestScore = Infinity;

        entries.forEach(function (entry) {
            const path = entry.path || '';
            const value = entry.value;
            if (!value) {
                return;
            }
            for (let i = 0; i < normalizedKeywords.length; i++) {
                const keyword = normalizedKeywords[i];
                let score = null;
                if (path === keyword) {
                    score = i * 10;
                } else if (path.endsWith(keyword)) {
                    score = i * 10 + 1;
                } else if (path.indexOf(keyword) !== -1) {
                    score = i * 10 + 2;
                }
                if (score !== null) {
                    if (preferIncludes.length && !preferIncludes.some(function (pref) { return path.indexOf(pref) !== -1; })) {
                        score += 100;
                    }
                    if (score < bestScore) {
                        bestScore = score;
                        best = entry;
                    }
                    break;
                }
            }
        });
        return best ? best.value : undefined;
    }

    function collectStrings(entries, keywords) {
        if (!entries || !entries.length || !keywords || !keywords.length) {
            return [];
        }
        const normalizedKeywords = keywords.map(function (keyword) { return keyword.toLowerCase(); });
        const seen = Object.create(null);
        const values = [];

        entries.forEach(function (entry) {
            const path = entry.path || '';
            const value = entry.value;
            if (!value) {
                return;
            }
            for (let i = 0; i < normalizedKeywords.length; i++) {
                const keyword = normalizedKeywords[i];
                if (path === keyword || path.endsWith(keyword) || path.indexOf(keyword) !== -1) {
                    const lowered = value.toLowerCase();
                    if (!seen[lowered]) {
                        seen[lowered] = true;
                        values.push(value);
                    }
                    break;
                }
            }
        });
        return values;
    }

    function extractMetric(flatPool, config) {
        if (!flatPool) {
            return { value: undefined, percent: undefined, delta: undefined, previous: undefined };
        }
        const valueEntry = findNumber(flatPool.numbers, config.valueKeywords, config.valueOptions || null);
        const deltaEntry = findNumber(flatPool.numbers, config.deltaKeywords, config.deltaOptions || null);
        const percentEntry = findNumber(flatPool.numbers, config.percentKeywords, config.percentOptions || null);
        const previousEntry = findNumber(flatPool.numbers, config.previousKeywords, config.valueOptions || null);

        const value = valueEntry ? valueEntry.value : undefined;
        const delta = deltaEntry ? deltaEntry.value : undefined;
        let percent = percentEntry ? normalizePercent(percentEntry.value, percentEntry.path) : undefined;
        const previous = previousEntry ? previousEntry.value : undefined;

        if (percent === undefined) {
            if (delta !== undefined && previous !== undefined && previous !== 0) {
                percent = (delta / previous) * 100;
            } else if (delta !== undefined && value !== undefined && (value - delta) !== 0) {
                percent = (delta / (value - delta)) * 100;
            }
        }

        return {
            value: value,
            percent: percent,
            delta: delta,
            previous: previous
        };
    }

    function normalizePercent(rawValue, path) {
        if (rawValue === null || rawValue === undefined) {
            return undefined;
        }
        const numeric = Number(rawValue);
        if (!isFinite(numeric)) {
            return undefined;
        }
        const lowerPath = (path || '').toLowerCase();
        if (lowerPath.indexOf('percent') !== -1 || lowerPath.indexOf('pct') !== -1) {
            return numeric;
        }
        if (Math.abs(numeric) <= 1) {
            return numeric * 100;
        }
        return numeric;
    }

    function aggregateMetric(pools, config) {
        let total = 0;
        let hasValue = false;
        let deltaSum = 0;
        let hasDelta = false;
        let previousSum = 0;
        let hasPrevious = false;
        let weightedPercentSum = 0;
        let percentWeight = 0;
        let hasPercent = false;

        pools.forEach(function (pool) {
            const metric = extractMetric(pool.flat, config);
            if (Number.isFinite(metric.value)) {
                total += metric.value;
                hasValue = true;
            }
            if (Number.isFinite(metric.delta)) {
                deltaSum += metric.delta;
                hasDelta = true;
            }
            if (Number.isFinite(metric.previous)) {
                previousSum += metric.previous;
                hasPrevious = true;
            }
            if (Number.isFinite(metric.percent) && Number.isFinite(metric.value)) {
                const weight = Math.max(Math.abs(metric.value), 1);
                weightedPercentSum += metric.percent * weight;
                percentWeight += weight;
                hasPercent = true;
            }
        });

        let percentChange;
        if (hasDelta && hasPrevious && previousSum !== 0) {
            percentChange = (deltaSum / previousSum) * 100;
        } else if (hasDelta && hasValue && (total - deltaSum) !== 0) {
            percentChange = (deltaSum / (total - deltaSum)) * 100;
        } else if (hasPercent && percentWeight) {
            percentChange = weightedPercentSum / percentWeight;
        } else if (hasDelta) {
            percentChange = 0;
        }

        return {
            total: hasValue ? total : undefined,
            percentChange: percentChange
        };
    }

    function formatCurrency(value) {
        if (!Number.isFinite(value)) {
            return '—';
        }
        const abs = Math.abs(value);
        let maximumFractionDigits = 0;
        if (abs < 1) {
            maximumFractionDigits = 4;
        } else if (abs < 100) {
            maximumFractionDigits = 2;
        } else if (abs < 1000) {
            maximumFractionDigits = 1;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: maximumFractionDigits
        }).format(value);
    }

    function formatToken(value, symbol) {
        if (!Number.isFinite(value)) {
            return '—';
        }
        const abs = Math.abs(value);
        let maximumFractionDigits = 0;
        if (abs < 1) {
            maximumFractionDigits = 4;
        } else if (abs < 100) {
            maximumFractionDigits = 2;
        } else if (abs < 1000) {
            maximumFractionDigits = 1;
        }
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: maximumFractionDigits
        }).format(value) + ' ' + (symbol || 'TEL');
    }

    function formatMetricValue(value, config) {
        if (config && config.type === 'token') {
            return formatToken(value, config.symbol);
        }
        return formatCurrency(value);
    }

    function formatPercent(change) {
        if (!Number.isFinite(change)) {
            return '—';
        }
        const abs = Math.abs(change);
        let decimals = 2;
        if (abs >= 100) {
            decimals = 0;
        } else if (abs >= 10) {
            decimals = 1;
        }
        const sign = change >= 0 ? '+' : '-';
        return sign + abs.toFixed(decimals) + '%';
    }

    function applyChange(element, change, options) {
        if (!element) {
            return;
        }
        element.classList.remove('positive', 'negative', 'neutral');
        if (!Number.isFinite(change)) {
            element.textContent = options && options.unavailableText ? options.unavailableText : 'Data unavailable';
            element.classList.add('neutral');
            return;
        }
        const formatted = formatPercent(change);
        element.textContent = options && options.suffix ? formatted + options.suffix : formatted;
        if (change > 0) {
            element.classList.add('positive');
        } else if (change < 0) {
            element.classList.add('negative');
        } else {
            element.classList.add('neutral');
        }
    }

    function getPoolName(pool) {
        const raw = pool.raw;
        if (raw) {
            const direct = raw.name || raw.label || raw.title || raw.pair || raw.pool;
            if (typeof direct === 'string' && direct.trim()) {
                return direct.trim();
            }
        }
        const fromStrings = findString(pool.flat.strings, ['name', 'title', 'pair', 'pool'], { preferIncludes: ['pool', 'pair', 'name'] });
        if (fromStrings && fromStrings.trim()) {
            return fromStrings.trim();
        }
        return 'Unnamed pool';
    }

    function getPoolStatus(pool) {
        const raw = pool.raw;
        if (raw) {
            const direct = raw.status || raw.lifecycle || raw.state || raw.phase;
            if (typeof direct === 'string' && direct.trim()) {
                return direct.trim();
            }
        }
        const fromStrings = findString(pool.flat.strings, ['status', 'lifecycle', 'state', 'phase']);
        if (fromStrings && fromStrings.trim()) {
            return fromStrings.trim();
        }
        return 'Unknown';
    }

    function getPoolRewards(pool) {
        const raw = pool.raw;
        const rewards = [];
        if (raw && Array.isArray(raw.rewards)) {
            raw.rewards.forEach(function (entry) {
                if (!entry) {
                    return;
                }
                if (typeof entry === 'string' && entry.trim()) {
                    rewards.push(entry.trim());
                } else if (entry.name && typeof entry.name === 'string') {
                    rewards.push(entry.name.trim());
                } else if (entry.title && typeof entry.title === 'string') {
                    rewards.push(entry.title.trim());
                }
            });
        }
        if (!rewards.length) {
            const collected = collectStrings(pool.flat.strings, ['reward', 'incentive', 'emission', 'program']);
            collected.forEach(function (entry) {
                if (entry && entry.trim()) {
                    rewards.push(entry.trim());
                }
            });
        }
        const unique = [];
        const seen = Object.create(null);
        rewards.forEach(function (entry) {
            const lowered = entry.toLowerCase();
            if (!seen[lowered]) {
                seen[lowered] = true;
                unique.push(entry);
            }
        });
        return unique.join(' · ');
    }

    function createStatusChip(status) {
        const span = document.createElement('span');
        span.classList.add('chip');
        const label = status && status.trim ? status.trim() : 'Unknown';
        const normalized = label.toLowerCase();
        if (normalized.indexOf('active') !== -1 || normalized.indexOf('live') !== -1 || normalized.indexOf('enabled') !== -1) {
            span.classList.add('chip-active');
        } else if (normalized.indexOf('deprecated') !== -1 || normalized.indexOf('sunset') !== -1 || normalized.indexOf('inactive') !== -1 || normalized.indexOf('ending') !== -1) {
            span.classList.add('chip-deprecated');
        } else if (normalized.indexOf('archived') !== -1 || normalized.indexOf('ended') !== -1 || normalized.indexOf('retired') !== -1) {
            span.classList.add('chip-archived');
        }
        span.textContent = label;
        return span;
    }

    function updateHomeStats(pools) {
        const statsError = document.querySelector('[data-pool-stats-error]');
        if (statsError) {
            statsError.classList.add('hidden');
        }
        Object.keys(METRIC_CONFIG).forEach(function (key) {
            const valueEl = document.querySelector('[data-stat-value="' + key + '"]');
            const changeEl = document.querySelector('[data-stat-change="' + key + '"]');
            if (!valueEl && !changeEl) {
                return;
            }
            const aggregate = aggregateMetric(pools, METRIC_CONFIG[key]);
            if (valueEl) {
                if (Number.isFinite(aggregate.total)) {
                    valueEl.textContent = formatMetricValue(aggregate.total, METRIC_CONFIG[key]);
                } else {
                    valueEl.textContent = '—';
                }
            }
            if (changeEl) {
                applyChange(changeEl, aggregate.percentChange, { suffix: ' vs 24h', unavailableText: 'Data unavailable' });
            }
        });
    }

    function updatePoolsTable(pools) {
        const tableBody = document.querySelector('[data-pool-table-body]');
        if (!tableBody) {
            return;
        }
        const errorBanner = document.querySelector('[data-pools-error]');
        if (errorBanner) {
            errorBanner.classList.add('hidden');
        }
        tableBody.innerHTML = '';
        if (!pools.length) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 7;
            cell.className = 'text-sm text-white/60';
            cell.textContent = 'No live TELx pool data available.';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }
        const rows = pools
            .map(function (pool) {
                return {
                    pool: pool,
                    metrics: {
                        tvl: extractMetric(pool.flat, METRIC_CONFIG.tvl),
                        staked: extractMetric(pool.flat, METRIC_CONFIG.staked),
                        volume: extractMetric(pool.flat, METRIC_CONFIG.volume),
                        fees: extractMetric(pool.flat, METRIC_CONFIG.fees)
                    }
                };
            })
            .map(function (entry) {
                return {
                    pool: entry.pool,
                    metrics: entry.metrics,
                    name: getPoolName(entry.pool),
                    status: getPoolStatus(entry.pool),
                    rewards: getPoolRewards(entry.pool)
                };
            });

        rows.sort(function (a, b) {
            const aValue = Number.isFinite(a.metrics.tvl.value) ? a.metrics.tvl.value : -Infinity;
            const bValue = Number.isFinite(b.metrics.tvl.value) ? b.metrics.tvl.value : -Infinity;
            return bValue - aValue;
        });

        rows.forEach(function (row) {
            const tr = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.className = 'font-medium text-white';
            nameCell.textContent = row.name;
            tr.appendChild(nameCell);

            const statusCell = document.createElement('td');
            statusCell.appendChild(createStatusChip(row.status));
            tr.appendChild(statusCell);

            ['tvl', 'staked', 'volume', 'fees'].forEach(function (metricKey) {
                const metricCell = document.createElement('td');
                const valueWrapper = document.createElement('div');
                valueWrapper.className = 'metric-value';
                valueWrapper.textContent = formatMetricValue(row.metrics[metricKey].value, METRIC_CONFIG[metricKey]);
                metricCell.appendChild(valueWrapper);
                const changeWrapper = document.createElement('div');
                changeWrapper.classList.add('value-change', 'mt-1', 'text-xs', 'font-medium');
                applyChange(changeWrapper, row.metrics[metricKey].percent, { suffix: ' · 24h' });
                metricCell.appendChild(changeWrapper);
                tr.appendChild(metricCell);
            });

            const rewardsCell = document.createElement('td');
            rewardsCell.className = 'text-sm text-white/70';
            rewardsCell.textContent = row.rewards || '—';
            tr.appendChild(rewardsCell);

            tableBody.appendChild(tr);
        });
    }

    function handleError(error) {
        console.error('[TELx pools] Unable to load live data:', error);
        const statsError = document.querySelector('[data-pool-stats-error]');
        if (statsError) {
            statsError.classList.remove('hidden');
        }
        document.querySelectorAll('[data-stat-change]').forEach(function (element) {
            element.textContent = 'Data unavailable';
            element.classList.remove('positive', 'negative');
            element.classList.add('neutral');
        });
        document.querySelectorAll('[data-stat-value]').forEach(function (element) {
            element.textContent = '—';
        });
        const tableBody = document.querySelector('[data-pool-table-body]');
        if (tableBody) {
            tableBody.innerHTML = '';
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 7;
            cell.className = 'text-sm text-white/60';
            cell.textContent = 'Unable to load TELx pool data. Visit telx.network/pools for the official dashboard.';
            row.appendChild(cell);
            tableBody.appendChild(row);
        }
        const poolsError = document.querySelector('[data-pools-error]');
        if (poolsError) {
            poolsError.classList.remove('hidden');
        }
    }
})();
