import {
  createStyles,
  Navbar,
  TextInput,
  Code,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Title,
} from "@mantine/core";
import { IconSearch, IconPlus, IconUser } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { generatePath, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getChannelsList } from "../lib/api/channels";
import { getUsersList } from "../lib/api/users";
import QueryKeys from "../lib/query-keys";
import openCreateChannel from "./modals/CreateChannelModal";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    // marginLeft: -theme.spacing.md,
    // marginRight: -theme.spacing.md,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  searchCode: {
    fontWeight: 700,
    fontSize: 10,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
  },

  collections: {
    paddingLeft: theme.spacing.md - 6,
    paddingRight: theme.spacing.md - 6,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: theme.spacing.md + 2,
    paddingRight: theme.spacing.md,
    marginBottom: 5,
  },

  collectionLink: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
    padding: `8px ${theme.spacing.xs}px`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.md,
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

export function NavbarSearch() {
  const { classes } = useStyles();
  const usersQuery = useQuery({
    queryKey: [QueryKeys.users.users_list],
    queryFn: getUsersList,
  });
  const channelsQuery = useQuery({
    queryKey: [QueryKeys.channels.channels_list],
    queryFn: getChannelsList,
  });

  const channelLinks = channelsQuery.isSuccess
    ? channelsQuery.data.map((channel) => (
        <Text
          component={NavLink}
          to={{
            pathname: generatePath("/chat/:chatType/:name", {
              name: channel.name,
              chatType: "channel",
            }),
          }}
          // onClick={(event) => event.preventDefault()}
          key={channel.name}
          className={classes.collectionLink}
        >
          <span>{channel.name}</span>
        </Text>
      ))
    : [];

  const auth = useAuth();
  const userLinks = usersQuery.isSuccess
    ? usersQuery.data
        .filter((user) => user.username !== auth.user?.username)
        .map((user) => (
          <Text
            component={NavLink}
            to={{
              pathname: generatePath("/chat/:chatType/:name", {
                name: user.username,
                chatType: "dm",
              }),
            }}
            key={user.email}
            className={classes.collectionLink}
          >
            <span>{user.name}</span>
          </Text>
        ))
    : [];

  return (
    <Navbar width={{ sm: 300 }} className={classes.navbar}>
      <Navbar.Section className={classes.section}>
        <Group px={"md"} h={80} position="apart">
          <Group spacing={"xs"}>
            <Title variant="gradient" fw={"bold"} ff="monospace" order={1}>
              CHAT
            </Title>
          </Group>
          <ActionIcon component={NavLink} to="/me">
            <IconUser color="blue" />
          </ActionIcon>
        </Group>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <TextInput
          placeholder="Search"
          size="xs"
          px={"md"}
          icon={<IconSearch size={12} stroke={1.5} />}
          rightSectionWidth={70}
          rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
          styles={{ rightSection: { pointerEvents: "none" } }}
          mb="sm"
        />
      </Navbar.Section>

      <ScrollArea type="never">
        <Navbar.Section className={classes.section}>
          <Group className={classes.collectionsHeader} position="apart">
            <Text size="xs" weight={500} color="dimmed">
              Direct messages
            </Text>
          </Group>
          <div className={classes.collections}>{userLinks}</div>
        </Navbar.Section>

        <Navbar.Section className={classes.section}>
          <Group className={classes.collectionsHeader} position="apart">
            <Text size="xs" weight={500} color="dimmed">
              Channels
            </Text>
            <Tooltip label="Create collection" withArrow position="right">
              <ActionIcon
                variant="default"
                onClick={() => openCreateChannel()}
                size={18}
              >
                <IconPlus size={12} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div className={classes.collections}>{channelLinks}</div>
        </Navbar.Section>
      </ScrollArea>
    </Navbar>
  );
}
