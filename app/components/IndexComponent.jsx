import { TitleBar, Modal } from '@shopify/app-bridge-react';
import { Banner, BlockStack, Box, Button, InlineStack, Text, TextField } from '@shopify/polaris'
import { StarIcon, StarFilledIcon, MagicIcon, ThumbsUpIcon } from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

function IndexComponent({
	history,
	match,
	setShowFeedbackModal,
	showFeedbackModal,
	setFeedback,
	feedback,
	setShowChannelForm,
	feedbackMatch,
}) {
	const shopify = useAppBridge();
	const fetcher = useFetcher();
	const [feedbackEmail, setFeedbackEmail] = useState("");
	const [feedbackContent, setFeedbackContent] = useState("");
	const [testimonialSubmitLoading, setTestimonialSubmitLoading] = useState(false);

	const handleSubmitFeedback = () => {
		setTestimonialSubmitLoading(true);
		fetcher.submit({
			score: feedback.score,
			scoreMsg: feedback.msg,
			email: feedbackEmail,
			content: feedbackContent
		}, { 
			method: "POST", 
			action: `/add-testimonial` 
		})
	}

	useEffect(()=>{	
		if(fetcher.data) {
			if(fetcher.data.success){
				shopify.toast.show("Thank you! Your feedback has been submitted");
			} else {
				if (fetcher.data.error) {
					shopify.toast.show(fetcher.data.error , { isError: true });
				} else {
					shopify.toast.show(`Failed to add channel: ${fetcher.data.error}`, { isError: true });
				}
			}
		}
		setTestimonialSubmitLoading(false);
	}, [fetcher.data])
	
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
				{(history) ? feedbackMatch ? (<Banner tone='info' icon={ThumbsUpIcon} ><Text variant='bodyMd' as='p'>Thank you for using Conative YouTube Carousel!</Text></Banner>): (
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
								<TextField onChange={(val) => {setFeedbackEmail(val)}} value={feedbackEmail} label="Email (Optional)" type="email" />
								<TextField onChange={(val) => {setFeedbackContent(val)}} value={feedbackContent} label="Feedback (Optional)" type="text" multiline={5} />
							</Box>
							<TitleBar title="Feedback">
								<button loading={testimonialSubmitLoading} onClick={handleSubmitFeedback} variant="primary">Submit</button>
								<button onClick={() => {shopify.modal.hide('my-modal')}}>Cancel</button>
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