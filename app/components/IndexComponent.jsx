import { TitleBar, Modal } from '@shopify/app-bridge-react';
import { Banner, BlockStack, Box, Button, InlineStack, Text, TextField } from '@shopify/polaris'
import { StarIcon, StarFilledIcon, MagicIcon } from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react';

function IndexComponent({
	history,
	setShowFeedbackModal,
	showFeedbackModal,
	setFeedback,
	feedback,
	setShowChannelForm,

}) {
	const shopify = useAppBridge();
	return (
		<BlockStack gap="300">
			<BlockStack gap="200">
				<Text variant="heading2xl" as="h3">
					Add latest youtube video carousel
				</Text>
				<Text variant="bodyMd" as="p">
					Enhance your Shopify store with our easy-to-use app that seamlessly integrates a customizable carousel, showcasing your products or featured content to captivate your customers' attention.
				</Text>
			</BlockStack>
			<BlockStack gap="200">
				<Text as="h3" variant="headingMd">
					Get started with the carousel
				</Text>
			</BlockStack>

			{<InlineStack gap="300">
				{history ? (
					<Banner tone="">
						<Text as="p">Are you enjoying using this carousel? <Button onClick={() => { setShowFeedbackModal(prev => !prev) }} variant="plain">Give us your feedback</Button></Text>
						<Modal id="my-modal" open={showFeedbackModal} onClose={() => { setShowFeedbackModal(prev => !prev) }} >
							<Box padding={400}>
								<Text variant="headingMd" tone="subdued">Your feedback is valuable</Text>
								<Box paddingBlock={300}>
									<InlineStack>
										<Box>
											<Box width="150px">
												<InlineStack wrap={false}>
													<Button variant="plain" onClick={() => { setFeedback(prev => ({ ...prev, score: 1, msg: "Very Poor!" })) }} icon={feedback.score >= 1 ? StarFilledIcon : StarIcon} alt="" />
													<Button variant="plain" onClick={() => { setFeedback(prev => ({ ...prev, score: 2, msg: "Could be better." })) }} icon={feedback.score >= 2 ? StarFilledIcon : StarIcon} alt="" />
													<Button variant="plain" onClick={() => { setFeedback(prev => ({ ...prev, score: 3, msg: "It was okay." })) }} icon={feedback.score >= 3 ? StarFilledIcon : StarIcon} alt="" />
													<Button variant="plain" onClick={() => { setFeedback(prev => ({ ...prev, score: 4, msg: "Good! I enjoyed it." })) }} icon={feedback.score >= 4 ? StarFilledIcon : StarIcon} alt="" />
													<Button variant="plain" onClick={() => { setFeedback(prev => ({ ...prev, score: 5, msg: "Amazing! This is the best." })) }} icon={feedback.score >= 5 ? StarFilledIcon : StarIcon} alt="" />
													<Box paddingInlineStart={100}>
														{`${feedback.score}/5`}
													</Box>
												</InlineStack>
											</Box>
											<Box>{feedback.msg}</Box>
										</Box>
									</InlineStack>
								</Box>
								<TextField label="Email" type="email" />
								<TextField label="Feedback" type="text" multiline={5} />
							</Box>
							<TitleBar title="Feedback">
								<button variant="primary">Submit</button>
								<button onClick={() => shopify.modal.hide('my-modal')}>Cancel</button>
							</TitleBar>
						</Modal>
					</Banner>) :
					(
						<Button
							size="large"
							icon={MagicIcon}
							variant="secondary"
							onClick={() => { setShowChannelForm(prev => !prev) }}
						>
							Add Carousel
						</Button>
					)
				}
			</InlineStack>}
		</BlockStack>
	)
}

export default IndexComponent