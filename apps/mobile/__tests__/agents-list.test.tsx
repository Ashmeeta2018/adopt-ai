import { render, screen } from '@testing-library/react-native';

// Mock @/lib/trpc — return a callable that the screen can use as trpc.agents.list.useQuery()
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

let AgentsListScreen: (typeof import('@/app/(portal)/agents/index'))['default'];
beforeAll(() => {
  AgentsListScreen = jest.requireActual<typeof import('@/app/(portal)/agents/index')>(
    '@/app/(portal)/agents/index',
  ).default;
});

beforeEach(() => {
  mockUseQuery.mockReset();
});

test('shows loading state', () => {
  mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });
  render(<AgentsListScreen />);
  expect(screen.UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
});

test('renders agent list with data', () => {
  const agents = [
    {
      id: 'a1',
      slug: 'triage',
      name: 'Inbox Triage',
      description: 'Triages emails',
      kind: 'INBOX_TRIAGE',
      status: 'RUNNING',
      organisationId: 'org1',
      workflowId: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { runs: 48 },
      workflow: null,
    },
    {
      id: 'a2',
      slug: 'docs',
      name: 'Doc Extraction',
      description: 'Extracts data',
      kind: 'DOCUMENT_EXTRACTION',
      status: 'RUNNING',
      organisationId: 'org1',
      workflowId: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { runs: 22 },
      workflow: null,
    },
  ];

  mockUseQuery.mockReturnValue({ data: agents, isLoading: false });
  render(<AgentsListScreen />);

  expect(screen.getByText('Inbox Triage')).toBeTruthy();
  expect(screen.getByText('Doc Extraction')).toBeTruthy();
  expect(screen.getByText(/2 agents/i)).toBeTruthy();
});

test('renders agent with accessibility label', () => {
  const agents = [
    {
      id: 'a1',
      slug: 'triage',
      name: 'Test Agent',
      description: 'Does testing',
      kind: 'INBOX_TRIAGE',
      status: 'RUNNING',
      organisationId: 'org1',
      workflowId: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { runs: 100 },
      workflow: null,
    },
  ];

  mockUseQuery.mockReturnValue({ data: agents, isLoading: false });
  render(<AgentsListScreen />);

  const card = screen.getByLabelText(/Test Agent/);
  expect(card).toBeTruthy();
  expect(card.props.accessibilityRole).toBe('button');
});
