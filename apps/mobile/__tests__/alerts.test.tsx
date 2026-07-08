import { render, screen } from '@testing-library/react-native';

const mockUseQuery = jest.fn();
const makeTrpcProxy = () =>
  new Proxy({} as Record<string, unknown>, {
    get() {
      return new Proxy({} as Record<string, unknown>, {
        get() {
          return new Proxy({} as Record<string, unknown>, {
            get(_target, method: string) {
              if (method === 'useQuery') {
                return (..._args: unknown[]) => mockUseQuery();
              }
              return jest.fn();
            },
          });
        },
      });
    },
  });

jest.mock('@/lib/trpc', () => ({
  trpc: makeTrpcProxy(),
  trpcClient: {},
}));

let AlertsScreen: (typeof import('@/app/(portal)/alerts'))['default'];
beforeAll(() => {
  AlertsScreen =
    jest.requireActual<typeof import('@/app/(portal)/alerts')>('@/app/(portal)/alerts').default;
});

beforeEach(() => {
  mockUseQuery.mockReset();
});

test('shows loading state', () => {
  mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });
  render(<AlertsScreen />);
  expect(screen.UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
});

test('renders today alerts', () => {
  mockUseQuery.mockReturnValue({
    data: {
      today: [
        {
          id: '1',
          severity: 'ops',
          title: 'Agent spike',
          body: 'p95 exceeded',
          read: false,
          ts: new Date().toISOString(),
        },
      ],
      earlier: [],
      nextCursor: null,
    },
    isLoading: false,
  });
  render(<AlertsScreen />);

  expect(screen.getByText('Agent spike')).toBeTruthy();
  expect(screen.getByText('p95 exceeded')).toBeTruthy();
  expect(screen.getByText('OPS')).toBeTruthy();
});

test('renders earlier alerts section', () => {
  mockUseQuery.mockReturnValue({
    data: {
      today: [],
      earlier: [
        {
          id: '2',
          severity: 'drift',
          title: 'Model drift detected',
          body: 'Rate dropped',
          read: true,
          ts: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      nextCursor: null,
    },
    isLoading: false,
  });
  render(<AlertsScreen />);

  expect(screen.getByText('Model drift detected')).toBeTruthy();
  expect(screen.getByText('EARLIER')).toBeTruthy();
});

test('shows notification header', () => {
  mockUseQuery.mockReturnValue({
    data: { today: [], earlier: [], nextCursor: null },
    isLoading: false,
  });
  render(<AlertsScreen />);

  expect(screen.getByText('NOTIFICATIONS')).toBeTruthy();
  expect(screen.getByText('Alerts & updates')).toBeTruthy();
});
