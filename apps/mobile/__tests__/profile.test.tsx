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

let ProfileScreen: (typeof import('@/app/(portal)/profile'))['default'];
beforeAll(() => {
  ProfileScreen =
    jest.requireActual<typeof import('@/app/(portal)/profile')>('@/app/(portal)/profile').default;
});

beforeEach(() => {
  mockUseQuery.mockReset();
});

test('shows loading state', () => {
  mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });
  render(<ProfileScreen />);
  expect(screen.getByText('Loading...')).toBeTruthy();
});

test('renders user initials from name', () => {
  mockUseQuery.mockReturnValue({
    data: {
      user: { email: 'maya@apex.example', name: 'Maya Lindqvist' },
      role: 'OWNER',
      organisation: { name: 'Apex Regional Logistics', plan: 'lift' },
    },
    isLoading: false,
  });
  render(<ProfileScreen />);

  expect(screen.getByText('ML')).toBeTruthy();
  expect(screen.getByText('Maya Lindqvist')).toBeTruthy();
  expect(screen.getByText('OWNER · Apex Regional Logistics')).toBeTruthy();
});

test('renders plan pill from settings', () => {
  mockUseQuery.mockReturnValue({
    data: {
      user: { email: 'test@example.com', name: 'Testname' },
      role: 'MEMBER',
      organisation: { name: 'Test Corp', plan: 'spark' },
    },
    isLoading: false,
  });
  render(<ProfileScreen />);

  expect(screen.getByText('T')).toBeTruthy();
  expect(screen.getByText('SPARK PLAN')).toBeTruthy();
});

test('renders all sections', () => {
  mockUseQuery.mockReturnValue({
    data: {
      user: { email: 'test@example.com', name: 'Test User' },
      role: 'ADMIN',
      organisation: { name: 'Test Org', plan: 'scale' },
    },
    isLoading: false,
  });
  render(<ProfileScreen />);

  expect(screen.getByText('ACCOUNT')).toBeTruthy();
  expect(screen.getByText('WORKSPACE')).toBeTruthy();
  expect(screen.getByText('SUPPORT')).toBeTruthy();
});
