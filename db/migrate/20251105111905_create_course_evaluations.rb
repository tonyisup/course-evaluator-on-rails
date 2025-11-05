class CreateCourseEvaluations < ActiveRecord::Migration[8.1]
  def change
    create_table :course_evaluations do |t|
      t.references :user, null: false, foreign_key: true
      t.string :input_type
      t.text :text_input
      t.integer :external_courses_count
      t.integer :internal_courses_count
      t.boolean :is_simple_mode
      t.jsonb :result

      t.timestamps
    end
  end
end
