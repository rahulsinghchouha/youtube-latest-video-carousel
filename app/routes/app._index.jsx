import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Text, Card, Button, BlockStack, InlineStack, Banner, Box, TextField, Tabs, List, FooterHelp, Link, CalloutCard } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { json } from "@remix-run/node"
import { getChannelInfo } from "../utils/utilFunctions";
import { TitleBar } from '@shopify/app-bridge-react';
import EditComponent from "../components/EditComponent";
import ChannelFormComponent from "../components/ChannelFormComponent";
import DocumentationAndFAQ from "../components/DocumentationAndFAQ";
import IndexComponent from "../components/IndexComponent";
import { decrypt } from "../utils/encryption";

export const loader = async ({ request }) => {
	let history = null;
	const { session } = await authenticate.admin(request);
	const match = await prisma.youTubeAPI.findFirst({
		where: {
			storeName: session.shop
		}
	});
	if (match) {
		history = await getChannelInfo(match.apiKey, match.channelName);
		match.apiKey = decrypt(match.apiKey)
	}
	return json({ history, match, ownApiKey:process.env.YOUTUBE_API_KEY,  });
};

export default function Index() {
	const { history, match, ownApiKey } = useLoaderData();
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [feedback, setFeedback] = useState({
		score: 0,
		msg: ""
	})
	const [showChannelForm, setShowChannelForm] = useState(false);
	const [selected, setSelected] = useState(0);
	const handleTabChange = useCallback(
		(selectedTabIndex) => setSelected(selectedTabIndex),
		[],
	);
	const tabs = [
		{
			id: 'home-content-1',
			content: 'Home',
			accessibilityLabel: 'Home',
			panelID: 'app-home-content-1',
		},
		{
			id: 'main-content-1',
			content: 'App',
			accessibilityLabel: 'App',
			panelID: 'app-main-content-1',
		},
		{
			id: 'documentation and FAQ-1',
			content: 'Guide',
			accessibilityLabel: 'Documentation & FAQs',
			panelID: 'documentation-faqs-content-1',
		},
	];


	useEffect(() => {
		if (history) setShowChannelForm(false);
	}, [history])

	return (
		<Page>
			<TitleBar title="Conative Youtube Carousel" />
			<BlockStack gap="500">
				<Layout>
					<Layout.Section variant="fullWidth">
						<Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted={false} canCreateNewView={false}>
							<Box paddingBlock={"300"} >
								{tabs[selected].id === "home-content-1" ? (
									<BlockStack gap={"300"}>
										
										<Box borderInlineStartWidth="075" padding={"300"} shadow="200" background="input-bg-surface" >
											<Text variant="headingMd" as="h1">Latest Youtube Video Carousel App</Text>
										</Box>
										<Box borderInlineStartWidth="075" padding={"300"} shadow="200" background="input-bg-surface" >
											<BlockStack gap={"300"}>
												<Text variant="bodyMd" as="p">Welcome to our Shopify Carousel App!</Text>
												<Text variant="bodyMd" as="p">Our app makes it simple to add a dynamic and engaging YouTube carousel to your online store. Here's how it works:</Text>
												<List type="number">
													<List.Item>YouTube API Key: Easily input your YouTube API key to get started.</List.Item>
													<List.Item>Select a Channel: Choose your preferred YouTube channel to display videos from.</List.Item>
													<List.Item>Pick a Playlist: Select a specific playlist from your chosen channel to feature.</List.Item>
												</List>
												<Text variant="bodyMd" as="p">
													Once set up, our app will automatically populate the carousel with the latest videos from your selected playlist, seamlessly integrating them into your store's homepage. This allows you to showcase your YouTube content directly to your customers, keeping them engaged and enhancing their shopping experience.
												</Text>
												<Text variant="bodyMd" as="p" >Start now and bring your store to life with the best of your YouTube content!</Text>
												<Text variant="bodyMd" as="p" >For <Link onClick={()=>{setSelected(2)}}>detailed tutorial</Link> on how to add the carousel to your store, go to the Guide tab.</Text>
												<Text variant="bodyMd" as="p" >Refer to our <Link url="/app/privacy-policy">Privacy Policy</Link></Text>
											</BlockStack>
										</Box>
										<Box borderInlineStartWidth="075" padding={"300"} shadow="200" background="input-bg-surface">
											<CalloutCard
												title="Your API Keys are encrypted and secured."
												illustration="./secure-3.png"
												primaryAction={{
													content: 'Go to App',
													url: '#',
													onAction: ()=>{setSelected(1)}
												}}
											>
												<p>We store your API Keys in an encrypted format on our database.</p>
											</CalloutCard>
										</Box>
									</BlockStack>
								) :
									tabs[selected].id === "main-content-1" ? (
										<BlockStack gap={"500"}>
											<Card>
												<IndexComponent feedback={feedback} history={history} setFeedback={setFeedback} setShowChannelForm={setShowChannelForm} setShowFeedbackModal={setShowFeedbackModal} showFeedbackModal={showFeedbackModal} />
											</Card>
											{history && <EditComponent match={match} history={history} ownApiKey={ownApiKey} />}
											{showChannelForm && (<ChannelFormComponent ownApiKey={ownApiKey} setShowFeedbackModal={setShowFeedbackModal} setShowChannelForm={setShowChannelForm} />)}
										</BlockStack>
									) : (
										<DocumentationAndFAQ />
									)
								}
							</Box>
						</Tabs>
					</Layout.Section>
				</Layout>
			</BlockStack>
			<FooterHelp align="end" >
				<Text variant="bodyMd" as="p">
					Copyright{' © ' + new Date().getFullYear() + ' '}
					Conative Youtube Carousel
				</Text>
			</FooterHelp>
		</Page>
	);
}
