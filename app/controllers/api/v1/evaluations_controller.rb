module Api
  module V1
    class EvaluationsController < ApplicationController
      before_action :authenticate_user!
      skip_before_action :verify_authenticity_token

      def index
        evaluations = current_user.course_evaluations.order(created_at: :desc)
        render json: evaluations.map { |e| format_evaluation(e) }
      end

      def create
        evaluation = current_user.course_evaluations.build(evaluation_params)

        # Handle image uploads from Active Storage signed IDs
        if params[:image_ids].present?
          params[:image_ids].each do |signed_id|
            blob = ActiveStorage::Blob.find_signed(signed_id)
            evaluation.images.attach(blob) if blob
          end
        end

        # Process the evaluation (this would call your AI service)
        # For now, we'll create a placeholder result
        if evaluation.save
          # Process evaluation in background job or synchronously
          result = process_evaluation(evaluation)
          evaluation.update(result: result)

          render json: result, status: :created
        else
          render json: { errors: evaluation.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def generate_upload_url
        # Return the URL to our upload endpoint
        # The frontend expects a string URL, not an object
        upload_url = url_for(action: :upload_file, controller: "api/v1/evaluations", only_path: false, host: request.host_with_port)
        render json: upload_url
      end
      
      def upload_file
        # This endpoint handles the actual file upload
        # The frontend POSTs the file in the request body with Content-Type header
        if request.body.present?
          # Read the file from request body
          file_data = request.body.read
          content_type = request.content_type || "image/jpeg"
          
          # Create a tempfile to upload
          temp_file = Tempfile.new([ "upload", ".jpg" ])
          temp_file.binmode
          temp_file.write(file_data)
          temp_file.rewind
          
          blob = ActiveStorage::Blob.create_and_upload!(
            io: temp_file,
            filename: "image.jpg",
            content_type: content_type
          )
          
          temp_file.close
          temp_file.unlink
          
          render json: { storageId: blob.signed_id }
        else
          render json: { error: "No file provided" }, status: :bad_request
        end
      end

      private

      def evaluation_params
        params.permit(:input_type, :text_input, :external_courses_count, :internal_courses_count, :is_simple_mode, :image_ids => [])
      end

      def format_evaluation(evaluation)
        {
          id: evaluation.id,
          _id: evaluation.id.to_s,
          inputType: evaluation.input_type,
          input_type: evaluation.input_type, # Keep both for compatibility
          textInput: evaluation.text_input,
          text_input: evaluation.text_input, # Keep both for compatibility
          externalCoursesCount: evaluation.external_courses_count,
          external_courses_count: evaluation.external_courses_count, # Keep both
          internalCoursesCount: evaluation.internal_courses_count,
          internal_courses_count: evaluation.internal_courses_count, # Keep both
          isSimpleMode: evaluation.is_simple_mode,
          is_simple_mode: evaluation.is_simple_mode, # Keep both
          result: evaluation.result || {},
          imageUrls: evaluation.images.map { |img| url_for(img) },
          image_urls: evaluation.images.map { |img| url_for(img) }, # Keep both
          _creationTime: evaluation.created_at.to_i * 1000
        }
      end

      def process_evaluation(evaluation)
        # TODO: Implement actual AI processing logic here
        # This should call your AI service (OpenAI, Anthropic, etc.)
        # to analyze the course descriptions and generate the evaluation
        
        # Placeholder response structure matching the frontend expectations
        {
          coverage: "High",
          confidence: "High",
          conclusion: "The courses are equivalent",
          courseMatches: "Course A matches Course B",
          reasoning: "Based on the course descriptions provided, both courses cover similar learning objectives and outcomes."
        }
      end

      def url_for(image)
        # Return full URL for the image blob
        Rails.application.routes.url_helpers.rails_blob_url(image, host: request.host_with_port)
      rescue
        # Fallback to path if URL generation fails
        Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true)
      end
    end
  end
end