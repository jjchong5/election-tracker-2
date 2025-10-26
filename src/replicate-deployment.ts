import Replicate from 'replicate';

async function runElectionTrackerDeployment() {
  try {
    console.log('🚀 Starting Replicate deployment...');
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    
    const output = await replicate.run(
      "jjchong5/election-tracker-2",
      {
        input: {
          image: "..."
        }
      }
    );
    
    console.log('✅ Prediction completed!');
    console.log('📊 Output:', output);
    
    return output;
  } catch (error) {
    console.error('❌ Error running deployment:', error);
    throw error;
  }
}

// Export the function for use in other modules
export { runElectionTrackerDeployment };

// Run the deployment if this file is executed directly
if (require.main === module) {
  runElectionTrackerDeployment()
    .then((output) => {
      console.log('🎉 Deployment completed successfully!');
      console.log('📋 Final output:', output);
    })
    .catch((error) => {
      console.error('💥 Deployment failed:', error);
      process.exit(1);
    });
}
